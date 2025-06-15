
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: string;
  type: string;
  name: string;
  uploadDate: string;
  status: "uploaded" | "verified" | "expired" | "rejected";
  size: number;
  url?: string;
}

interface BusinessDocumentUploadProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  onDocumentsUpdate: (documents: Document[]) => void;
}

const BusinessDocumentUpload: React.FC<BusinessDocumentUploadProps> = ({
  isOpen,
  onClose,
  businessId,
  onDocumentsUpdate
}) => {
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  const documentTypes = [
    "SSM Certificate",
    "Business License",
    "Tax Registration",
    "Bank Statement",
    "Insurance Certificate",
    "Environmental Permit",
    "Construction License",
    "Trade License"
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, JPG, PNG files are allowed");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDoc: Document = {
        id: `DOC${Date.now()}`,
        type: docType,
        name: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        status: "uploaded",
        size: file.size,
        url: URL.createObjectURL(file)
      };

      const updatedDocs = [...documents, newDoc];
      setDocuments(updatedDocs);
      onDocumentsUpdate(updatedDocs);
      toast.success(`${docType} uploaded successfully`);
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = (docId: string) => {
    const updatedDocs = documents.filter(doc => doc.id !== docId);
    setDocuments(updatedDocs);
    onDocumentsUpdate(updatedDocs);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "text-green-600";
      case "uploaded": return "text-blue-600";
      case "expired": return "text-orange-600";
      case "rejected": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected": return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <FileText className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Document Upload - Business ID: {businessId}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentTypes.map((docType) => (
              <div key={docType} className="border rounded-lg p-4">
                <Label className="font-medium">{docType}</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e, docType)}
                    className="hidden"
                    id={`upload-${docType}`}
                    disabled={uploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById(`upload-${docType}`)?.click()}
                    disabled={uploading}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? "Uploading..." : "Upload File"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Documents List */}
          {documents.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Uploaded Documents</h3>
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(doc.status)}
                    <div>
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-sm text-gray-500">
                        {doc.type} • {(doc.size / 1024).toFixed(1)}KB • {doc.uploadDate}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status.toUpperCase()}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeDocument(doc.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessDocumentUpload;
