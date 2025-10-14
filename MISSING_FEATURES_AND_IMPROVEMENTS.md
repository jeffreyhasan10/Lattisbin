
### ❌ **4. Collection Reminder System (CRITICAL)**
**Status:** Mock data in DriverDashboard, not implemented in admin

**Required Components:**
- `CollectionReminderSystem.tsx` - Manage bin collection schedules
- Integration in BookingsAndDOs for auto-reminders
- Integration in admin dashboard for alerts

**Required Features:**
```typescript
// Missing Features:
- Auto-prompt after bin delivery
- Same-day vs term-based collection scheduling
- Manual collection reminder creation
- Collection reminder calendar view
- Driver notification system
- SMS/Email/WhatsApp reminders
- Overdue collection alerts
- Collection history per bin

// API Endpoints (from spec):
POST /v1/delivery-orders/:id/collection-reminder
  - reminder_type: "same_day|term_based"
  - scheduled_date
GET /v1/delivery-orders?collection_due_date=
```

**Current State:**
- ✅ Mock collection data in DriverDashboard (lines 92-120)
- ❌ No admin interface for scheduling
- ❌ No auto-reminder after delivery
- ❌ No notification system
- ❌ No reminder tracking

---

### ❌ **5. Real-time Notifications (IMPORTANT)**
**Status:** LiveNotifications.tsx exists but not integrated

**Required Features:**
```typescript
// Missing Features:
- WebSocket/SSE connection for real-time updates
- Notification center in admin dashboard
- Push notifications for critical events
- Notification preferences management
- Mark as read/unread
- Notification categories (payment, collection, alerts)

// Events (from spec):
- do.assigned → Notify driver
- payment.received → Notify admin
- invoice.issued → Notify customer
- reminder.scheduled → Notify driver & admin
- lorry.alert → Document expiry warnings
- commission.approved → Notify introducer
```

**Current State:**
- ❌ No WebSocket implementation
- ❌ No notification center
- ❌ LiveNotifications component not connected

---

### ⚠️ **6. Improved Features Needed**

#### **A. Lorry Document Expiry Alerts**
**Location:** LorryManagement.tsx
```typescript
// Current: Basic listing
// Needed:
- Auto-alert 30 days before expiry
- Dashboard widget showing expiring documents
- Email/SMS notifications to admin
- Renewal tracking
- Document upload history
```

#### **B. Bin Movement Ledger**
**Location:** BinInventoryManagement.tsx
```typescript
// Current: Basic inventory
// Needed:
- Complete bin movement history
- IN/OUT/TRANSFER/REPAIR tracking
- Location tracking (warehouse → customer → warehouse)
- Movement reports per bin SN
- Area-wise bin distribution reports

// API Endpoints:
GET /v1/bins/:id/movements
POST /v1/bins/:id/movements
GET /v1/reports/bins/inout-by-sn?serial_number=ASR100
GET /v1/reports/bins/area-out?area=klang_valley
```

#### **C. Advanced Booking Filters**
**Location:** BookingsAndDOs.tsx
```typescript
// Current: Basic filters
// Needed:
- Filter by area/state
- Filter by driver assigned
- Filter by date range (from/to)
- Filter by payment status
- Filter by commission status
- Advanced search by multiple fields
- Saved filter presets
```

#### **D. Invoice Search by Phone**
**Location:** InvoiceManagement.tsx
```typescript
// Required per spec:
- Quick search by customer phone number
GET /v1/invoices/search?phone=+60123456789
- Display all invoices for that customer
- Quick payment recording from search results
```

#### **E. DO Manual Book Number Uniqueness**
**Location:** BookingsAndDOs.tsx, CreateBooking.tsx
```typescript
// Required:
- Validate unique DO book number per series
- Prevent duplicate manual DO book numbers
- Series management (AS-2025-, LSR-2025-, etc.)
```

---

## 📋 **DRIVER APP - MISSING FEATURES**

### ❌ **1. Minimum 3 Photos Upload (CRITICAL)**
**Status:** Only 1 photo upload in ConfirmCollection.tsx

**Required Changes:**
**File:** `ConfirmCollection.tsx`
```typescript
// Current: Single photo upload (line 76-84)
const [wastePhoto, setWastePhoto] = useState<File | null>(null);

// Required: Multiple photos (minimum 3)
const [wastePhotos, setWastePhotos] = useState<File[]>([]);
const MIN_PHOTOS = 3;

// Validation
if (wastePhotos.length < MIN_PHOTOS) {
  toast.error(`Minimum ${MIN_PHOTOS} photos required for waste documentation`);
  return;
}

// API Endpoint:
POST /v1/delivery-orders/:id/attach
Content-Type: multipart/form-data
files[]: [file1.jpg, file2.jpg, file3.jpg]
```

**UI Requirements:**
- Multi-file upload input
- Photo preview grid (3+ thumbnails)
- Remove individual photos
- Camera capture for mobile
- Photo count indicator (e.g., "2/3 photos uploaded")

---

### ❌ **2. Receipt Generation & Viewing (CRITICAL)**
**Status:** Receipt generation mentioned but not implemented

**Required Components:**
- `ViewReceipt.tsx` - Display receipt details
- Receipt generation in TripRecordPayment.tsx

**Required Features:**
```typescript
// Missing Features:
- Generate receipt immediately for cash payments
- Receipt number auto-generation (RCPT-2025-00031)
- View receipt after payment recorded
- Print/share receipt (PDF/image)
- Receipt QR code for verification
- Email/WhatsApp receipt to customer

// API Endpoints:
POST /v1/delivery-orders/:id/receipt
  - payment_method: "CASH"
  - amount: 350.00
  - reference: "Cash collected on site"
Response: { receipt_number: "RCPT-2025-00031" }

GET /v1/invoices/:id/receipts - List receipts
```

**Current State:**
- ✅ Payment recording (TripRecordPayment.tsx)
- ❌ No receipt generation
- ❌ No receipt viewing
- ❌ No receipt printing

---

### ❌ **3. Collection Reminders & Notifications (IMPORTANT)**
**Status:** Mock data displayed, no real integration

**Required Features:**
```typescript
// Missing Features:
- Receive real-time collection reminders
- Push notifications for scheduled collections
- View upcoming collections in calendar view
- Mark collection as completed
- Delay/reschedule collection
- Collection completion photo requirement

// WebSocket Events:
- reminder.scheduled → Display notification
- collection.due_today → Alert driver
- collection.overdue → Urgent alert
```

**Current State:**
- ✅ Mock collections displayed (DriverDashboard lines 92-120)
- ❌ No real-time notifications
- ❌ No collection completion workflow

---

### ❌ **4. Real-time Trip Assignment (IMPORTANT)**
**Status:** No live updates

**Required Features:**
```typescript
// Missing Features:
- Real-time notification when trip assigned
- Auto-refresh trip list when new assignment
- Accept/reject trip assignment
- View trip assignment details before accepting
- Estimated time and route preview

// WebSocket Events:
- do.assigned → New trip notification
- do.updated → Trip details changed
- trip.cancelled → Trip cancelled by admin
```

---

### ⚠️ **5. Improved Features Needed**

#### **A. Trip Navigation**
**Location:** MyTrips.tsx, TripDetails.tsx
```typescript
// Current: Opens Google Maps in browser
// Needed:
- In-app turn-by-turn navigation
- Real-time location tracking
- ETA updates to admin
- Route optimization for multiple trips
- Traffic alerts
```

#### **B. Offline Support**
```typescript
// Needed:
- Cache trip details for offline viewing
- Queue actions when offline (payment recording, status updates)
- Sync when connection restored
- Offline mode indicator
- Critical data persistence
```

#### **C. Enhanced Trip History**
**Location:** TripHistory.tsx
```typescript
// Current: Basic listing
// Needed:
- Filter by date range
- Filter by completion status
- Search by customer/location
- Monthly/weekly summaries
- Earnings summary per period
- Export trip history
```

#### **D. Profile & Performance**
**Location:** DriverProfile.tsx
```typescript
// Needed:
- Performance metrics dashboard
- Trips completed this month
- Total earnings
- Average rating (if rating system exists)
- Commission earned
- Pending payments
```

