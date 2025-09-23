# Lattis Bin Management System - API Specification v1

> **Complete REST API specification** for the Lattis Bin Management System, covering all Admin and Driver operations from authentication to reporting.

## 📋 Table of Contents

1. [API Conventions & Standards](#api-conventions--standards)
2. [System Overview & Flows](#system-overview--flows)
3. [Authentication & Authorization](#authentication--authorization)
4. [Core Entity Management](#core-entity-management)
5. [Operational Workflows](#operational-workflows)
6. [Financial Operations](#financial-operations)
7. [Reporting & Analytics](#reporting--analytics)
8. [System Services](#system-services)
9. [Error Handling & Validation](#error-handling--validation)

---

## 🔧 API Conventions & Standards

### Base Configuration
- **Base URL**: `/v1`
- **Authentication**: Bearer JWT tokens
- **Content-Type**: `application/json` (except file uploads)
- **Timezone**: All dates stored in UTC, returned as ISO 8601
- **IDs**: UUID v4 format
- **Pagination**: `?page=1&limit=20`
- **Search**: `?q=search_term`
- **Date Range**: `?from=YYYY-MM-DD&to=YYYY-MM-DD`

### Request Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
Idempotency-Key: <unique_key>  # For critical operations
```

### Response Format
```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

---

## 🏗️ System Overview & Flows

### Core Business Flows

#### 1. **Complete Order Lifecycle**
```
Booking → Assignment → Delivery Order → Invoice → Payment → Receipt → Commission
```

#### 2. **Bin Movement Cycle**
```
Warehouse → Assigned → With Customer → Collected → Repair (optional) → Warehouse
```

#### 3. **Driver Daily Workflow**
```
Login → View Assignments → Start Trip → Upload Photos → Deliver → Collect Payment → Close Order
```

### Entity State Machines

#### Delivery Order States
```
draft → issued → pending_invoice → invoiced_linked → closed
  ↓
cancelled (with reason)
```

#### Invoice States
```
draft → issued → partially_paid → paid → closed
  ↓
voided (admin only)
```

#### Bin States
```
in_warehouse → assigned → with_customer → collected → repair → in_warehouse
```

### User Roles & Permissions

| Role | Capabilities |
|------|-------------|
| **ADMIN** | Full system access, invoice management, reporting, user management |
| **DRIVER** | Order execution, photo uploads, payment collection, status updates |

---

## 🔐 Authentication & Authorization

### Authentication Endpoints

#### Admin Login
```http
POST /v1/auth/login
Content-Type: application/json

{
  "email": "admin@lattis.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "role": "ADMIN",
      "email": "admin@lattis.com",
      "name": "Admin User"
    }
  }
}
```

#### Driver Login
```http
POST /v1/auth/driver-login
Content-Type: application/json

{
  "driverName": "Ahmad Rahman",
  "icNumber": "920815-14-5678",
  "phoneNumber": "012-3456789"
}
```

#### Token Management
- `POST /v1/auth/refresh` - Refresh access token
- `POST /v1/auth/logout` - Invalidate tokens
- `GET /v1/me` - Get current user profile

---

## 🏢 Core Entity Management

### Business Profile (Admin Only)

#### Get Business Information
```http
GET /v1/business
Authorization: Bearer <admin_token>
```

#### Update Business Profile
```http
PATCH /v1/business
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Lattis Bin Services Sdn Bhd",
  "roc_number": "123456-A",
  "address": "123 Jalan Ampang, 50450 Kuala Lumpur",
  "email": "info@lattis.com",
  "phone": "+603-12345678"
}
```

### Customer Management (Admin Only)

#### List Customers
```http
GET /v1/customers?q=search_term&page=1&limit=20
Authorization: Bearer <admin_token>
```

#### Create Customer
```http
POST /v1/customers
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "company_name": "ABC Construction Sdn Bhd",
  "contact_name": "John Doe",
  "phone": "+60123456789",
  "email": "john@abc.com",
  "address": "456 Jalan Puchong, 47100 Puchong",
  "gst_no": "GST123456789",
  "sst_no": "SST987654321"
}
```

#### Customer Operations
- `GET /v1/customers/:id` - Get customer details
- `PATCH /v1/customers/:id` - Update customer information

### Driver Management (Admin Only)

#### List Drivers
```http
GET /v1/drivers?q=search_term&status=active
Authorization: Bearer <admin_token>
```

#### Create Driver
```http
POST /v1/drivers
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Ahmad Rahman",
  "ic_number": "920815-14-5678",
  "phone": "012-3456789",
  "email": "ahmad@lattis.com",
  "address": "789 Jalan Klang, 50000 Kuala Lumpur",
  "status": "active"
}
```

### Fleet Management (Admin Only)

#### Lorry Operations
- `GET /v1/lorries?q=search_term&status=available` - List lorries
- `POST /v1/lorries` - Add new lorry
- `GET /v1/lorries/:id` - Get lorry details
- `PATCH /v1/lorries/:id` - Update lorry information
- `GET /v1/lorries/alerts?withinDays=30` - Get expiry alerts

#### Rentable Lorries
- `GET /v1/rentable-lorries` - List external lorries
- `POST /v1/rentable-lorries` - Add rentable lorry
- `PATCH /v1/rentable-lorries/:id` - Update rentable lorry

### Inventory Management (Admin Only)

#### Bin Operations
- `GET /v1/bins?q=search_term&status=in_warehouse&area=klang_valley` - List bins
- `POST /v1/bins` - Add new bin
- `GET /v1/bins/:id` - Get bin details
- `PATCH /v1/bins/:id` - Update bin information

#### Bin Movement Tracking
```http
GET /v1/bins/:id/movements
Authorization: Bearer <admin_token>
```

```http
POST /v1/bins/:id/movements
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "movement_type": "OUT|IN|TRANSFER|REPAIR",
  "related_do_id": "uuid",
  "area": "Klang Valley",
  "state": "Selangor",
  "notes": "Delivered to customer site"
}
```

### Waste Items (Admin Only)

#### Waste Item Management
- `GET /v1/waste-items` - List waste categories
- `POST /v1/waste-items` - Add new waste type
- `PATCH /v1/waste-items/:id` - Update waste item

---

## 🚚 Operational Workflows

### Booking Management

#### Create Booking (Admin/Driver)
```http
POST /v1/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "customer_id": "uuid",
  "requested_bin_size": {
    "h_ft": 4,
    "l_ft": 12,
    "w_ft": 6
  },
  "area": "Klang Valley",
  "state": "Selangor",
  "scheduled_at": "2024-01-15T09:00:00Z",
  "notes": "Construction site delivery"
}
```

#### Booking Operations
- `GET /v1/bookings?status=pending&area=klang_valley&from=2024-01-01&to=2024-01-31` - List bookings
- `GET /v1/bookings/:id` - Get booking details
- `PATCH /v1/bookings/:id` - Update booking

### Order Management (Admin Only)

#### List Orders
```http
GET /v1/orders?status=assigned&driver_id=uuid&from=2024-01-01&to=2024-01-31
Authorization: Bearer <admin_token>
```

#### Assign Order to Driver
```http
POST /v1/orders/:id/assign
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "driver_id": "uuid",
  "lorry_id": "uuid"
}
```

### Delivery Order Management

#### Create Delivery Order
```http
POST /v1/delivery-orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "customer_id": "uuid",
  "driver_id": "uuid",
  "lorry_id": "uuid",
  "inventory_bin_id": "uuid",
  "do_by_name": "John Doe",
  "company_name": "ABC Construction",
  "phone": "+60123456789",
  "do_book_number": "AS-2025-00123",
  "bin_size": {
    "h_ft": 4,
    "l_ft": 12,
    "w_ft": 6
  },
  "payment_method": "CASH",
  "amount": 350.00,
  "weight_kg": 1200,
  "waste_items": [
    {
      "waste_item_id": "uuid",
      "description": "Construction debris",
      "quantity": 1,
      "unit": "load",
      "price": 350.00
    }
  ]
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "status": "issued",
    "system_do_number": "DO-2025-00045",
    "customer_id": "uuid",
    "driver_id": "uuid",
    "lorry_id": "uuid",
    "inventory_bin_id": "uuid",
    "amount": 350.0,
    "payment_method": "CASH",
    "created_at": "2024-01-15T09:00:00Z",
    "updated_at": "2024-01-15T09:00:00Z"
  }
}
```

#### Delivery Order Operations

**Admin Operations:**
- `GET /v1/delivery-orders?status=issued&driver_id=uuid` - List DOs
- `GET /v1/delivery-orders/:id` - Get DO details
- `PATCH /v1/delivery-orders/:id` - Update DO
- `POST /v1/delivery-orders/:id/issue` - Issue official DO
- `POST /v1/delivery-orders/:id/cancel` - Cancel with reason

**Driver Operations:**
- `GET /v1/me/delivery-orders?status=assigned` - Get driver's DOs
- `PATCH /v1/delivery-orders/:id/status` - Update status
- `PATCH /v1/delivery-orders/:id/assign-lorry` - Select lorry (if allowed)

#### Upload Photos (Driver)
```http
POST /v1/delivery-orders/:id/attach
Authorization: Bearer <driver_token>
Content-Type: multipart/form-data

files[]: [file1.jpg, file2.jpg, file3.jpg]  # Minimum 3 photos required
```

#### Issue Receipt for DO Payment (Driver)
```http
POST /v1/delivery-orders/:id/receipt
Authorization: Bearer <driver_token>
Content-Type: application/json

{
  "payment_method": "CASH",
  "amount": 350.00,
  "reference": "Cash collected on site"
}
```

#### Collection Reminder
```http
POST /v1/delivery-orders/:id/collection-reminder
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "reminder_type": "same_day|term_based",
  "scheduled_date": "2024-01-20T10:00:00Z"
}
```

---

## 💰 Financial Operations

### Invoice Management (Admin Only)

#### Create Invoice from Delivery Order
```http
POST /v1/invoices/from-do/:deliveryOrderId
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "invoice_number": "INV-2025-00012",
    "status": "issued",
    "delivery_order_id": "uuid",
    "subtotal": 350.0,
    "tax": 0,
    "total": 350.0,
    "issued_at": "2024-01-15T10:00:00Z"
  }
}
```

#### Invoice Operations
- `GET /v1/invoices?status=issued&customer_id=uuid&from=2024-01-01&to=2024-01-31` - List invoices
- `GET /v1/invoices/:id` - Get invoice details
- `PATCH /v1/invoices/:id` - Update invoice
- `POST /v1/invoices/:id/issue` - Issue invoice
- `POST /v1/invoices/:id/void` - Void invoice
- `GET /v1/invoices/:id/pdf` - Download PDF
- `GET /v1/invoices/search?phone=+60123456789` - Search by phone

#### Record Payment
```http
POST /v1/invoices/:id/payments
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "method": "CASH|ONLINE|CDM|EWALLET|CHEQUE|TERM",
  "amount": 350.00,
  "reference": "Bank transfer ref: TXN123456"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "invoice_id": "uuid",
    "method": "CASH",
    "amount": 350.0,
    "receipt_number": "RCPT-2025-00031",
    "received_at": "2024-01-15T11:00:00Z"
  }
}
```

#### Payment & Receipt Retrieval
- `GET /v1/invoices/:id/receipts` - List receipts for invoice
- `GET /v1/payments?invoice_id=uuid&method=CASH&from=2024-01-01&to=2024-01-31` - List payments
- `GET /v1/payments/:id` - Get payment details

### Commission Management (Admin Only)

#### List Commissions
```http
GET /v1/commissions?status=eligible
Authorization: Bearer <admin_token>
```

#### Approve Commission
```http
POST /v1/commissions/:deliveryOrderId/approve
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "amount": 50.00,
  "introducer_name": "John Referrer"
}
```

#### Pay Commission
```http
POST /v1/commissions/:id/pay
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "payment_method": "BANK_TRANSFER",
  "reference": "Commission payment for DO-2025-00045"
}
```

### Refund Management (Admin Only)

#### Create Refund Request
```http
POST /v1/refunds
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "target_type": "DO|INVOICE",
  "target_id": "uuid",
  "reason": "Overcharge due to incorrect bin size",
  "amount": 50.00
}
```

#### Refund Operations
- `GET /v1/refunds?status=pending&from=2024-01-01&to=2024-01-31` - List refunds
- `POST /v1/refunds/:id/approve` - Approve refund
- `POST /v1/refunds/:id/process` - Process refund

### Expense Management (Admin Only)

#### List Expenses
```http
GET /v1/expenses?from=2024-01-01&to=2024-01-31&category=fuel
Authorization: Bearer <admin_token>
```

#### Create Expense
```http
POST /v1/expenses
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "category": "fuel|maintenance|salary|other",
  "description": "Fuel for lorry ABC123",
  "amount": 150.00,
  "expense_date": "2024-01-15",
  "receipt_url": "https://storage.example.com/receipts/fuel_001.pdf"
}
```

---

## 📎 System Services

### File Attachments

#### Upload Files
```http
POST /v1/attachments
Authorization: Bearer <token>
Content-Type: multipart/form-data

target_type: "DO|INVOICE|LORRY"
target_id: "uuid"
files[]: [file1.jpg, file2.pdf]
```

#### List Attachments
```http
GET /v1/attachments?target_type=DO&target_id=uuid
Authorization: Bearer <token>
```

### Lorry Trip Tracking

#### Create Trip
```http
POST /v1/lorry-trips
Authorization: Bearer <token>
Content-Type: application/json

{
  "lorry_id": "uuid",
  "driver_id": "uuid",
  "from_location": "Warehouse KL",
  "to_location": "ABC Construction Site",
  "inventory_bin_id": "uuid",
  "related_do_id": "uuid",
  "departed_at": "2024-01-15T09:00:00Z"
}
```

#### Update Trip
```http
PATCH /v1/lorry-trips/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "arrived_at": "2024-01-15T10:30:00Z",
  "notes": "Traffic delay on Jalan Ampang"
}
```

#### List Trips
```http
GET /v1/lorry-trips?lorry_id=uuid&driver_id=uuid&from=2024-01-01&to=2024-01-31
Authorization: Bearer <token>
```

---

## 📊 Reporting & Analytics

### Summary Reports
```http
GET /v1/reports/summary?from=2024-01-01&to=2024-01-31
Authorization: Bearer <admin_token>
```

### Customer Reports
- `GET /v1/reports/customers` - Customer analytics
- `GET /v1/reports/invoices/by-client-paid?customer_id=uuid` - Customer payment history
- `GET /v1/reports/invoices/by-client-pending?customer_id=uuid` - Pending payments

### Inventory Reports
- `GET /v1/reports/inventory` - Inventory overview
- `GET /v1/reports/bins/stock-on-hand` - Current bin stock
- `GET /v1/reports/bins/inout-by-sn?serial_number=ASR100` - Bin movement history
- `GET /v1/reports/bins/area-out?area=klang_valley&state=selangor` - Area-wise bin distribution

### Fleet Reports
- `GET /v1/reports/lorries` - Lorry utilization
- `GET /v1/reports/lorries/trips?lorry_id=uuid&driver_id=uuid&from=2024-01-01&to=2024-01-31` - Trip history
- `GET /v1/reports/rentable-lorries` - External lorry usage

### Operational Reports
- `GET /v1/reports/drivers` - Driver performance
- `GET /v1/reports/bookings` - Booking analytics
- `GET /v1/reports/delivery-orders` - DO statistics
- `GET /v1/reports/delivery-orders/daily-totals?from=2024-01-01&to=2024-01-31` - Daily totals
- `GET /v1/reports/delivery-orders/payments-by-method?from=2024-01-01&to=2024-01-31` - Payment methods
- `GET /v1/reports/delivery-orders/cash-vs-pending?from=2024-01-01&to=2024-01-31` - Cash vs pending
- `GET /v1/reports/delivery-orders/by-driver?driver_id=uuid&from=2024-01-01&to=2024-01-31` - Driver performance

### Financial Reports
- `GET /v1/reports/invoices` - Invoice analytics
- `GET /v1/reports/invoices/period-sales?granularity=daily&from=2024-01-01&to=2024-01-31` - Sales by period
- `GET /v1/reports/invoices/pending-alerts` - Pending payment alerts
- `GET /v1/reports/invoices/area-wise?area=klang_valley&state=selangor` - Area-wise sales
- `GET /v1/reports/invoices/by-method?method=CASH` - Payment method analysis
- `GET /v1/reports/commissions` - Commission reports
- `GET /v1/reports/refunds` - Refund analytics
- `GET /v1/reports/expenses?from=2024-01-01&to=2024-01-31&category=fuel` - Expense reports

---

## 🖨️ Printing Services

### Print Documents
```http
GET /v1/print/do/:id?a4=true
Authorization: Bearer <admin_token>
```

#### Available Print Formats
- `GET /v1/print/do/:id?a4=true|false` - Delivery Order (A4 or thermal)
- `GET /v1/print/invoice/:id?a4=true|false` - Invoice (A4 or thermal)
- `GET /v1/print/receipt/:paymentId?a4=false` - Receipt (thermal only)

---

## 🔔 Notifications & Real-time Updates

### Notification Management
```http
GET /v1/notifications
Authorization: Bearer <token>
```

#### Mark Notifications as Read
```http
PATCH /v1/notifications/:id/read
Authorization: Bearer <token>
```

```http
POST /v1/notifications/read-all
Authorization: Bearer <token>
```

### Real-time Events
- **WebSocket**: `ws://api.lattis.com/v1/ws`
- **Server-Sent Events**: `GET /v1/events`

#### Event Types
- `do.assigned` - New DO assigned to driver
- `payment.received` - Payment recorded
- `invoice.issued` - Invoice created
- `reminder.scheduled` - Collection reminder set
- `lorry.alert` - Document expiry warning

---

## ⚠️ Error Handling & Validation

### Validation Rules

#### Business Rules
- **Unique Constraints**: Bin serial numbers, invoice numbers, DO book numbers (per series)
- **Required Fields**: DO must include customer, bin SN, size, payment type, amount
- **State Transitions**: Invoice creation only from DO in `PendingInvoice|Issued` state
- **Commission Rules**: Commission only after invoice status is `Paid`
- **Refund Limits**: Refund amount cannot exceed total paid for target
- **Document Requirements**: Lorry documents must include expiry dates with alerts
- **Photo Requirements**: DO waste items must have minimum 3 photos

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "field": "amount",
      "reason": "Must be greater than 0"
    }
  }
}
```

### HTTP Status Codes

| Code | Error Type | Description |
|------|------------|-------------|
| `400` | `VALIDATION_ERROR` | Schema validation failed |
| `401` | `UNAUTHORIZED` | Missing or invalid token |
| `403` | `FORBIDDEN` | Role/resource access denied |
| `404` | `NOT_FOUND` | Entity not found |
| `409` | `CONFLICT` | Unique constraint violation |
| `412` | `PRECONDITION_FAILED` | Invalid state transition |
| `429` | `RATE_LIMITED` | Too many requests |
| `500` | `INTERNAL_ERROR` | Unexpected server error |

### Security & Compliance

#### Authentication & Authorization
- **Password Hashing**: Argon2 or bcrypt
- **JWT Tokens**: Role-based claims with expiration
- **Resource Ownership**: Drivers restricted to own DOs only
- **Audit Logging**: All mutations logged with actor, action, entity, before/after states, timestamp

#### Data Protection
- **PII Masking**: IC/passport numbers masked in logs
- **File Uploads**: Virus scanning and S3-compatible storage
- **Input Validation**: Schema-based validation (Zod/Joi)

---

## 🔄 System Events & Background Jobs

### Event Types
- `do.issued` - Delivery order created
- `do.cancelled` - Delivery order cancelled
- `invoice.issued` - Invoice created
- `invoice.paid` - Payment received
- `invoice.voided` - Invoice voided
- `commission.approved` - Commission approved
- `commission.paid` - Commission paid
- `refund.requested` - Refund requested
- `refund.approved` - Refund approved
- `refund.processed` - Refund processed
- `lorry.alert.expiring_document` - Document expiry warning

### Background Jobs
- **Document Expiry Scan**: Daily scan for lorry document expiries
- **Pending DO Digest**: Daily summary of DOs without invoices
- **Payment Reminders**: Automated reminders for pending payments
- **Commission Eligibility**: Auto-detect eligible commissions after payment
- **Collection Reminders**: Schedule and send bin collection reminders

### Idempotency
- Use `Idempotency-Key` header for critical operations
- Supported operations: DO issue, payments, receipt issuance
- Server de-duplicates within 24-hour window

---

## 🎯 Complete Workflow Examples

### 1. Complete Order Lifecycle
```
1. Admin/Driver creates booking
   POST /v1/bookings

2. Admin assigns driver and lorry
   POST /v1/orders/:id/assign

3. Admin issues delivery order
   POST /v1/delivery-orders

4. System auto-creates invoice draft
   POST /v1/invoices/from-do/:deliveryOrderId

5. Admin issues invoice
   POST /v1/invoices/:id/issue

6. Customer makes payment
   POST /v1/invoices/:id/payments

7. Receipt automatically generated
   GET /v1/invoices/:id/receipts

8. Commission becomes eligible
   POST /v1/commissions/:deliveryOrderId/approve
```

### 2. Driver Cash Collection
```
1. Driver collects cash on site
   POST /v1/delivery-orders/:id/receipt

2. Receipt number returned immediately
   Response: { "receipt_number": "RCPT-2025-00031" }

3. Later reconciled against invoice
   GET /v1/invoices/:id/receipts
```

### 3. Bin Collection Reminder
```
1. After delivery, schedule reminder
   POST /v1/delivery-orders/:id/collection-reminder

2. Notification sent via WebSocket/SSE
   Event: "reminder.scheduled"

3. Driver collects bin and updates status
   PATCH /v1/delivery-orders/:id/status

4. Bin movement recorded
   POST /v1/bins/:id/movements
```

---

## 👥 Role-Based Access Control

### Admin Permissions
- **Full Access**: Business, drivers, lorries, bins, waste items
- **Financial**: Invoices, payments, commissions, refunds, expenses
- **Operations**: Assignments, DO issue/cancel, printing, reports
- **System**: All administrative functions

### Driver Permissions
- **Limited Access**: Own DOs, bookings, lorry trips
- **Operations**: Upload photos, update status, collect payments
- **Self-Service**: Profile management, notifications
- **Restrictions**: Cannot access financial or administrative functions

---

## 📋 Implementation Checklist

### Phase 1: Core Infrastructure
- [ ] Authentication system (JWT + RBAC)
- [ ] Database setup (PostgreSQL + Prisma)
- [ ] File storage (S3-compatible)
- [ ] Basic CRUD operations

### Phase 2: Business Logic
- [ ] Order lifecycle management
- [ ] Payment processing
- [ ] Invoice generation
- [ ] Commission calculation

### Phase 3: Advanced Features
- [ ] Real-time notifications
- [ ] Background jobs
- [ ] Reporting system
- [ ] Printing services

### Phase 4: Integration
- [ ] Frontend API integration
- [ ] Mobile app support
- [ ] Third-party integrations
- [ ] Performance optimization


