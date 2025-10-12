import React, { createContext, useContext, useState, useEffect } from "react";

export interface Payment {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerType: "Corporate" | "Individual" | "Government";
  amount: number;
  paymentDate: string;
  paymentMode: "Cash" | "Online" | "CDM" | "E-Wallet";
  status: "pending" | "received" | "overdue";
  dueDate: string;
  transactionRef?: string;
  notes?: string;
  orderIds?: string[];
}

interface PaymentContextType {
  payments: Payment[];
  addPayment: (payment: Omit<Payment, "id">) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  recordPayment: (invoiceNumber: string, paymentData: Partial<Payment>) => void;
  getPaymentsByInvoice: (invoiceNumber: string) => Payment[];
  getPaymentStats: () => {
    totalReceived: number;
    totalPending: number;
    totalOverdue: number;
    totalAmount: number;
    paymentByMode: Record<string, number>;
    paymentsCount: {
      received: number;
      pending: number;
      overdue: number;
    };
  };
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [payments, setPayments] = useState<Payment[]>([]);

  // Initialize with sample data
  useEffect(() => {
    const samplePayments: Payment[] = [
      {
        id: "PAY001",
        invoiceNumber: "INV-2024-001",
        customerName: "ABC Construction Sdn Bhd",
        customerType: "Corporate",
        amount: 1961.0,
        paymentDate: "2024-03-15",
        paymentMode: "Online",
        status: "received",
        dueDate: "2024-03-31",
        transactionRef: "TXN20240315001",
        orderIds: ["DO001", "DO002"],
      },
      {
        id: "PAY002",
        invoiceNumber: "INV-2024-002",
        customerName: "Sarah Lim",
        customerType: "Individual",
        amount: 339.2,
        paymentDate: "2024-03-18",
        paymentMode: "E-Wallet",
        status: "received",
        dueDate: "2024-03-20",
        transactionRef: "EWALLET20240318002",
        orderIds: ["DO003"],
      },
      {
        id: "PAY003",
        invoiceNumber: "INV-2024-003",
        customerName: "Ministry of Health",
        customerType: "Government",
        amount: 2650.0,
        paymentDate: "",
        paymentMode: "Online",
        status: "pending",
        dueDate: "2024-04-09",
        orderIds: ["DO004", "DO005"],
      },
      {
        id: "PAY004",
        invoiceNumber: "INV-2024-004",
        customerName: "Tech Innovators Sdn Bhd",
        customerType: "Corporate",
        amount: 5500.0,
        paymentDate: "2024-03-10",
        paymentMode: "CDM",
        status: "received",
        dueDate: "2024-03-25",
        transactionRef: "CDM20240310004",
        orderIds: ["DO006"],
      },
      {
        id: "PAY005",
        invoiceNumber: "INV-2024-005",
        customerName: "John Tan",
        customerType: "Individual",
        amount: 450.0,
        paymentDate: "",
        paymentMode: "Cash",
        status: "overdue",
        dueDate: "2024-03-05",
        orderIds: ["DO007"],
      },
      {
        id: "PAY006",
        invoiceNumber: "INV-2024-006",
        customerName: "Green Solutions Ltd",
        customerType: "Corporate",
        amount: 2800.0,
        paymentDate: "2024-03-20",
        paymentMode: "Online",
        status: "received",
        dueDate: "2024-04-01",
        transactionRef: "TXN20240320006",
        orderIds: ["DO008", "DO009"],
      },
      {
        id: "PAY007",
        invoiceNumber: "INV-2024-007",
        customerName: "Mary Wong",
        customerType: "Individual",
        amount: 280.0,
        paymentDate: "",
        paymentMode: "E-Wallet",
        status: "pending",
        dueDate: "2024-04-10",
        orderIds: ["DO010"],
      },
      {
        id: "PAY008",
        invoiceNumber: "INV-2024-008",
        customerName: "City Council",
        customerType: "Government",
        amount: 8500.0,
        paymentDate: "2024-03-12",
        paymentMode: "Online",
        status: "received",
        dueDate: "2024-03-30",
        transactionRef: "TXN20240312008",
        orderIds: ["DO011", "DO012", "DO013"],
      },
      {
        id: "PAY009",
        invoiceNumber: "INV-2024-009",
        customerName: "Sunrise Development",
        customerType: "Corporate",
        amount: 3200.0,
        paymentDate: "2024-03-22",
        paymentMode: "Cash",
        status: "received",
        dueDate: "2024-04-05",
        transactionRef: "CASH20240322009",
        orderIds: ["DO014"],
      },
      {
        id: "PAY010",
        invoiceNumber: "INV-2024-010",
        customerName: "David Lee",
        customerType: "Individual",
        amount: 175.0,
        paymentDate: "",
        paymentMode: "Online",
        status: "overdue",
        dueDate: "2024-03-08",
        orderIds: ["DO015"],
      },
    ];

    setPayments(samplePayments);
  }, []);

  const addPayment = (payment: Omit<Payment, "id">) => {
    const newPayment: Payment = {
      ...payment,
      id: `PAY${String(payments.length + 1).padStart(3, "0")}`,
    };
    setPayments((prev) => [...prev, newPayment]);
  };

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    setPayments((prev) =>
      prev.map((payment) => (payment.id === id ? { ...payment, ...updates } : payment))
    );
  };

  const deletePayment = (id: string) => {
    setPayments((prev) => prev.filter((payment) => payment.id !== id));
  };

  const recordPayment = (invoiceNumber: string, paymentData: Partial<Payment>) => {
    const payment = payments.find((p) => p.invoiceNumber === invoiceNumber);
    if (payment) {
      updatePayment(payment.id, {
        ...paymentData,
        status: "received",
        paymentDate: paymentData.paymentDate || new Date().toISOString().split("T")[0],
      });
    }
  };

  const getPaymentsByInvoice = (invoiceNumber: string) => {
    return payments.filter((p) => p.invoiceNumber === invoiceNumber);
  };

  const getPaymentStats = () => {
    const totalReceived = payments
      .filter((p) => p.status === "received")
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPending = payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);

    const totalOverdue = payments
      .filter((p) => p.status === "overdue")
      .reduce((sum, p) => sum + p.amount, 0);

    const totalAmount = totalReceived + totalPending + totalOverdue;

    const paymentByMode = {
      Cash: payments
        .filter((p) => p.paymentMode === "Cash" && p.status === "received")
        .reduce((sum, p) => sum + p.amount, 0),
      Online: payments
        .filter((p) => p.paymentMode === "Online" && p.status === "received")
        .reduce((sum, p) => sum + p.amount, 0),
      CDM: payments
        .filter((p) => p.paymentMode === "CDM" && p.status === "received")
        .reduce((sum, p) => sum + p.amount, 0),
      "E-Wallet": payments
        .filter((p) => p.paymentMode === "E-Wallet" && p.status === "received")
        .reduce((sum, p) => sum + p.amount, 0),
    };

    const paymentsCount = {
      received: payments.filter((p) => p.status === "received").length,
      pending: payments.filter((p) => p.status === "pending").length,
      overdue: payments.filter((p) => p.status === "overdue").length,
    };

    return {
      totalReceived,
      totalPending,
      totalOverdue,
      totalAmount,
      paymentByMode,
      paymentsCount,
    };
  };

  const value: PaymentContextType = {
    payments,
    addPayment,
    updatePayment,
    deletePayment,
    recordPayment,
    getPaymentsByInvoice,
    getPaymentStats,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};

export const usePayments = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePayments must be used within a PaymentProvider");
  }
  return context;
};

