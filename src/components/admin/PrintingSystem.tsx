
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Printer, Plus, QrCode, FileText, Receipt, Truck, Settings, Download } from "lucide-react";

const PrintingSystem: React.FC = () => {
  const [templates, setTemplates] = useState([
    {
      id: "TPL001",
      name: "Invoice Template - Corporate",
      category: "Invoice",
      format: "A4",
      description: "Professional invoice template for corporate clients with detailed breakdown",
      lastUsed: "2024-03-15",
      usageCount: 156,
      status: "active"
    },
    {
      id: "TPL002",
      name: "Delivery Order - Thermal",
      category: "Delivery Order",
      format: "Thermal",
      description: "Compact delivery order for field operations with QR code",
      lastUsed: "2024-03-16",
      usageCount: 89,
      status: "active"
    },
    {
      id: "TPL003",
      name: "Bin Label with QR Code",
      category: "Asset Label",
      format: "Label",
      description: "Waterproof bin labels with QR codes for tracking",
      lastUsed: "2024-03-10",
      usageCount: 245,
      status: "active"
    },
    {
      id: "TPL004",
      name: "Monthly Report - A4",
      category: "Report",
      format: "A4",
      description: "Comprehensive monthly performance report with charts",
      lastUsed: "2024-03-01",
      usageCount: 12,
      status: "active"
    }
  ]);

  const [printJobs, setPrintJobs] = useState([
    {
      id: "JOB001",
      templateName: "Invoice Template - Corporate",
      documentType: "Invoice",
      customerName: "ABC Construction Sdn Bhd",
      quantity: 1,
      format: "A4",
      status: "completed",
      submittedAt: "2024-03-16 10:30",
      completedAt: "2024-03-16 10:32",
      printerUsed: "HP LaserJet Pro M404n"
    },
    {
      id: "JOB002",
      templateName: "Delivery Order - Thermal",
      documentType: "Delivery Order",
      customerName: "Sarah Lim",
      quantity: 2,
      format: "Thermal",
      status: "printing",
      submittedAt: "2024-03-16 11:15",
      completedAt: null,
      printerUsed: "Zebra ZD420"
    },
    {
      id: "JOB003",
      templateName: "Bin Label with QR Code",
      documentType: "Asset Label",
      customerName: "Internal Use",
      quantity: 50,
      format: "Label",
      status: "queued",
      submittedAt: "2024-03-16 11:45",
      completedAt: null,
      printerUsed: "Brother QL-820NWB"
    }
  ]);

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "printing":
        return <Badge className="bg-blue-100 text-blue-800">Printing</Badge>;
      case "queued":
        return <Badge className="bg-orange-100 text-orange-800">Queued</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "A4":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "Thermal":
        return <Receipt className="h-4 w-4 text-green-500" />;
      case "Label":
        return <QrCode className="h-4 w-4 text-purple-500" />;
      default:
        return <Printer className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Printer className="h-6 w-6 text-blue-600" />
            Multi-Format Printing System
          </h2>
          <p className="text-gray-600 mt-1">A4 and thermal printing with barcode generation and custom templates</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showPrintModal} onOpenChange={setShowPrintModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Print Document</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Printer</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select printer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hp_laser">HP LaserJet Pro M404n (A4)</SelectItem>
                      <SelectItem value="zebra_thermal">Zebra ZD420 (Thermal)</SelectItem>
                      <SelectItem value="brother_label">Brother QL-820NWB (Label)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Document Reference</Label>
                  <Input placeholder="e.g., INV001, DO001" />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" placeholder="1" min="1" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Customer/Reference</Label>
                  <Input placeholder="Customer name or internal reference" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPrintModal(false)}>Cancel</Button>
                <Button onClick={() => setShowPrintModal(false)}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Print Template</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Template Name</Label>
                  <Input placeholder="e.g., Invoice Template - SME" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invoice">Invoice</SelectItem>
                      <SelectItem value="delivery">Delivery Order</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                      <SelectItem value="label">Asset Label</SelectItem>
                      <SelectItem value="receipt">Receipt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4 (210 × 297 mm)</SelectItem>
                      <SelectItem value="thermal">Thermal (80mm wide)</SelectItem>
                      <SelectItem value="label">Label (62 × 29 mm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Include QR Code</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes, include QR code</SelectItem>
                      <SelectItem value="no">No QR code needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe the template purpose and usage" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowTemplateModal(false)}>Cancel</Button>
                <Button onClick={() => setShowTemplateModal(false)}>Create Template</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Printing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Printer className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Active Templates</p>
                <p className="text-2xl font-bold">{templates.filter(t => t.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Jobs Today</p>
                <p className="text-2xl font-bold">{printJobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">QR Codes Generated</p>
                <p className="text-2xl font-bold">{templates.reduce((sum, t) => sum + t.usageCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Active Printers</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Print Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getFormatIcon(template.format)}
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{template.category}</Badge>
                          <Badge variant="outline">{template.format}</Badge>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{template.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{template.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Last Used</p>
                      <p className="font-medium">{template.lastUsed}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Usage Count</p>
                      <p className="font-medium">{template.usageCount} times</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <FileText className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Edit Template
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Printer className="h-3 w-3 mr-1" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Print Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Print Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {printJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {getFormatIcon(job.format)}
                  <div>
                    <h4 className="font-medium">{job.templateName}</h4>
                    <p className="text-sm text-gray-600">{job.customerName} • Qty: {job.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <p className="text-gray-500">Submitted</p>
                    <p className="font-medium">{job.submittedAt}</p>
                    {job.completedAt && (
                      <>
                        <p className="text-gray-500">Completed</p>
                        <p className="font-medium">{job.completedAt}</p>
                      </>
                    )}
                  </div>
                  {getStatusBadge(job.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintingSystem;
