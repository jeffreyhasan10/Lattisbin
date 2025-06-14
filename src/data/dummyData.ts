
// Company information
export const companyData = {
  name: "EcoWaste Solutions",
  address: "123 Jalan Waste, Kuala Lumpur",
  postcode: "50450",
  phone: "+60 3-1234 5678",
  email: "info@ecowaste.com",
  registrationNo: "ECO12345-MY",
  sst: "SST-123456789",
  contactPerson: "Ahmad Zulkifli",
  website: "www.ecowaste.com"
};

// Overview metrics
export const metricsData = [
  { title: "Total Bins", value: 150, icon: "package" },
  { title: "Active Bookings", value: 25, icon: "calendar" },
  { title: "Pending Payments", value: "RM 5,000", icon: "credit-card" },
  { title: "Lorries in Service", value: 10, icon: "truck" },
  { title: "Customers", value: 78, icon: "users" },
  { title: "This Month Revenue", value: "RM 12,500", icon: "trending-up" }
];

// Customer data
export const customersData = [
  { 
    id: 1, 
    name: "John Doe", 
    phone: "012-3456789", 
    email: "john@example.com", 
    address: "15 Jalan Besar", 
    area: "Kuala Lumpur", 
    state: "Wilayah Persekutuan", 
    postcode: "50100", 
    companyRegNo: "JD-12345", 
    idNumber: "821112-14-1234", 
    gstSST: "SST-987654321" 
  },
  { 
    id: 2, 
    name: "Azlan Sdn Bhd", 
    phone: "013-9876543", 
    email: "info@azlansb.com", 
    address: "45 Jalan Industri", 
    area: "Shah Alam", 
    state: "Selangor", 
    postcode: "40000", 
    companyRegNo: "AS-67890", 
    idNumber: "N/A", 
    gstSST: "GST-54321" 
  },
  { 
    id: 3, 
    name: "Mary Lee", 
    phone: "017-2345678", 
    email: "mary@example.com", 
    address: "22 Lorong Damai", 
    area: "George Town", 
    state: "Penang", 
    postcode: "10050", 
    companyRegNo: "N/A", 
    idNumber: "910523-07-5678", 
    gstSST: "N/A" 
  },
  { 
    id: 4, 
    name: "Eco Industries Bhd", 
    phone: "019-8765432", 
    email: "contact@ecoindustries.com", 
    address: "88 Jalan Perindustrian", 
    area: "Johor Bahru", 
    state: "Johor", 
    postcode: "80300", 
    companyRegNo: "EI-13579", 
    idNumber: "N/A", 
    gstSST: "SST-24680" 
  }
];

// Bin inventory data
export const binsData = [
  { id: 1, serialNumber: "ASR100", size: "10 Yard", status: "In Use", location: "Kuala Lumpur", customer: "John Doe", dateOut: "2025-04-05", expectedReturn: "2025-04-15" },
  { id: 2, serialNumber: "ASR101", size: "15 Yard", status: "Available", location: "Depot", customer: null, dateOut: null, expectedReturn: null },
  { id: 3, serialNumber: "LSR150", size: "20 Yard", status: "In Use", location: "Shah Alam", customer: "Azlan Sdn Bhd", dateOut: "2025-04-08", expectedReturn: "2025-04-22" },
  { id: 4, serialNumber: "BSR200", size: "6 Yard", status: "In Use", location: "Penang", customer: "Mary Lee", dateOut: "2025-04-01", expectedReturn: "2025-04-11" },
  { id: 5, serialNumber: "BSR201", size: "4 Yard", status: "Available", location: "Depot", customer: null, dateOut: null, expectedReturn: null },
  { id: 6, serialNumber: "LSR151", size: "15 Yard", status: "Maintenance", location: "Workshop", customer: null, dateOut: null, expectedReturn: null }
];

// Lorry data
export const lorriesData = [
  { 
    id: 1, 
    model: "Hino 500", 
    tonnage: "5 Ton", 
    number: "WXX 1234", 
    roadTaxExpiry: "2025-06-30", 
    insuranceExpiry: "2025-05-15", 
    status: "Active",
    lastMaintenance: "2025-03-15",
    nextMaintenance: "2025-05-15"
  },
  { 
    id: 2, 
    model: "Isuzu NPR", 
    tonnage: "3 Ton", 
    number: "WCN 5678", 
    roadTaxExpiry: "2025-05-20", 
    insuranceExpiry: "2025-05-20", 
    status: "Active",
    lastMaintenance: "2025-03-25",
    nextMaintenance: "2025-05-25"
  },
  { 
    id: 3, 
    model: "Mitsubishi Fuso", 
    tonnage: "10 Ton", 
    number: "VBC 9012", 
    roadTaxExpiry: "2025-04-25", 
    insuranceExpiry: "2025-04-25", 
    status: "Maintenance",
    lastMaintenance: "2025-04-01",
    nextMaintenance: "2025-06-01"
  }
];

// Drivers data
export const driversData = [
  { id: 1, name: "Ahmad bin Ali", type: "Internal", licenseType: "D", licenseExpiry: "2026-05-30", lorry: "WXX 1234", contactNumber: "012-3456789" },
  { id: 2, name: "Chong Wei Ming", type: "Internal", licenseType: "D", licenseExpiry: "2027-02-15", lorry: "WCN 5678", contactNumber: "013-9876543" },
  { id: 3, name: "Rajesh Kumar", type: "Third-party", licenseType: "E", licenseExpiry: "2025-11-20", lorry: "VBC 9012", contactNumber: "017-2345678" }
];

// Waste collection data
export const collectionsData = [
  { 
    id: 1, 
    type: "Scrap Metal", 
    date: "2025-04-10", 
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"], 
    weight: "500 kg",
    customer: "John Doe",
    binSN: "ASR100",
    location: "Kuala Lumpur"
  },
  { 
    id: 2, 
    type: "Plastic Waste", 
    date: "2025-04-08", 
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"], 
    weight: "200 kg",
    customer: "Azlan Sdn Bhd",
    binSN: "LSR150",
    location: "Shah Alam"
  },
  { 
    id: 3, 
    type: "Bulk Trash", 
    date: "2025-04-05", 
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"], 
    weight: "750 kg",
    customer: "Mary Lee",
    binSN: "BSR200",
    location: "Penang"
  }
];

// Booking and delivery orders data
export const bookingsData = [
  { 
    id: 1, 
    doNumber: "DO001", 
    customer: "John Doe", 
    binSN: "ASR100", 
    status: "Delivered", 
    payment: "Cash",
    area: "Kuala Lumpur",
    date: "2025-04-05",
    amount: "RM 500",
    lorry: "WXX 1234",
    driver: "Ahmad bin Ali"
  },
  { 
    id: 2, 
    doNumber: "DO002", 
    customer: "Azlan Sdn Bhd", 
    binSN: "LSR150", 
    status: "Pending", 
    payment: "Online",
    area: "Shah Alam",
    date: "2025-04-08",
    amount: "RM 750",
    lorry: "WCN 5678",
    driver: "Chong Wei Ming"
  },
  { 
    id: 3, 
    doNumber: "DO003", 
    customer: "Mary Lee", 
    binSN: "BSR200", 
    status: "Delivered", 
    payment: "CDM",
    area: "Penang",
    date: "2025-04-01",
    amount: "RM 350",
    lorry: "VBC 9012",
    driver: "Rajesh Kumar"
  },
  { 
    id: 4, 
    doNumber: "DO004", 
    customer: "Eco Industries Bhd", 
    binSN: "ASR101", 
    status: "Scheduled", 
    payment: "Pending",
    area: "Johor Bahru",
    date: "2025-04-15",
    amount: "RM 600",
    lorry: "WXX 1234",
    driver: "Ahmad bin Ali"
  }
];

// Invoice data
export const invoicesData = [
  { 
    id: 1, 
    invoiceNumber: "INV001", 
    doNumber: "DO001", 
    phone: "012-3456789", 
    amount: "RM 500", 
    status: "Paid",
    customer: "John Doe",
    date: "2025-04-05",
    paymentMethod: "Cash", 
    paymentDate: "2025-04-05"
  },
  { 
    id: 2, 
    invoiceNumber: "INV002", 
    doNumber: "DO003", 
    phone: "017-2345678", 
    amount: "RM 350", 
    status: "Paid",
    customer: "Mary Lee",
    date: "2025-04-01",
    paymentMethod: "CDM", 
    paymentDate: "2025-04-01"
  },
  { 
    id: 3, 
    invoiceNumber: "INV003", 
    doNumber: "DO002", 
    phone: "013-9876543", 
    amount: "RM 750", 
    status: "Pending",
    customer: "Azlan Sdn Bhd",
    date: "2025-04-08",
    paymentMethod: "Online", 
    paymentDate: null
  }
];

// Reports data - Fixed trend values to match expected "up" | "down" | "neutral" type
// And added icon properties
export const reportsData = {
  dailyBookings: {
    title: "Daily Bookings",
    value: 3,
    change: "+1 from yesterday",
    trend: "up" as const,
    icon: "calendar"
  },
  pendingPayments: {
    title: "Pending Payments",
    value: "RM 750",
    change: "-RM 500 from yesterday",
    trend: "down" as const,
    icon: "credit-card"
  },
  binStock: {
    title: "Bin Stock",
    value: "3 Available",
    change: "0 change",
    trend: "neutral" as const,
    icon: "package"
  },
  monthlyRevenue: {
    title: "Monthly Revenue",
    value: "RM 12,500",
    change: "+15% from last month",
    trend: "up" as const,
    icon: "trending-up"
  },
  binUtilization: {
    title: "Bin Utilization",
    value: "75%",
    change: "+5% from last week",
    trend: "up" as const,
    icon: "bar-chart-3"
  }
};
