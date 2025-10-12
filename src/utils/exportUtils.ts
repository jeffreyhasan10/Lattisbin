import { Payment } from "@/contexts/PaymentContext";

export const exportToCSV = (data: Payment[], filename: string = "payment-report.csv") => {
  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  // Define CSV headers
  const headers = [
    "Invoice Number",
    "Customer Name",
    "Customer Type",
    "Amount (RM)",
    "Payment Mode",
    "Payment Date",
    "Due Date",
    "Status",
    "Transaction Reference",
    "Notes",
  ];

  // Convert data to CSV rows
  const rows = data.map((payment) => [
    payment.invoiceNumber,
    payment.customerName,
    payment.customerType,
    payment.amount.toFixed(2),
    payment.paymentMode,
    payment.paymentDate || "N/A",
    payment.dueDate,
    payment.status,
    payment.transactionRef || "N/A",
    payment.notes || "",
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = async (data: Payment[], filename: string = "payment-report.pdf") => {
  // This is a placeholder for PDF export functionality
  // In a real application, you would use a library like jsPDF or pdfmake
  alert("PDF export functionality will be available soon. For now, please use CSV export.");
  
  // Example implementation with jsPDF (would need to install: npm install jspdf jspdf-autotable)
  /*
  const { jsPDF } = await import('jspdf');
  const autoTable = await import('jspdf-autotable');
  
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Payment Overview Report', 14, 22);
  
  // Add date
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Prepare table data
  const tableData = data.map(payment => [
    payment.invoiceNumber,
    payment.customerName,
    payment.customerType,
    `RM ${payment.amount.toFixed(2)}`,
    payment.paymentMode,
    payment.paymentDate || 'N/A',
    payment.status,
  ]);
  
  // Add table
  autoTable(doc, {
    head: [['Invoice', 'Customer', 'Type', 'Amount', 'Mode', 'Date', 'Status']],
    body: tableData,
    startY: 35,
  });
  
  doc.save(filename);
  */
};

export const formatCurrency = (amount: number, currency: string = "RM"): string => {
  return `${currency} ${amount.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-MY", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const isOverdue = (dueDate: string, status: string): boolean => {
  if (status === "received") return false;
  const today = new Date();
  const due = new Date(dueDate);
  return due < today;
};

export const getDaysUntilDue = (dueDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

