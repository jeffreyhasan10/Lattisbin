
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Phone, Mail, Plus, Edit, Trash2, Crown, Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ContactPerson {
  id: string;
  name: string;
  role: "Primary" | "Secondary" | "Emergency";
  phone: string;
  email: string;
  icNumber?: string;
  position?: string;
  department?: string;
  isActive: boolean;
  accessLevel: "Full" | "Limited" | "View Only";
  canPlaceOrders: boolean;
  canViewBilling: boolean;
  canModifyProfile: boolean;
}

interface ContactPersonManagerProps {
  customerId: string;
  contacts: ContactPerson[];
  onContactsUpdate: (contacts: ContactPerson[]) => void;
}

const ContactPersonManager: React.FC<ContactPersonManagerProps> = ({
  customerId,
  contacts,
  onContactsUpdate
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactPerson | null>(null);
  const [newContact, setNewContact] = useState({
    name: "",
    role: "Secondary" as const,
    phone: "",
    email: "",
    icNumber: "",
    position: "",
    department: "",
    accessLevel: "Limited" as const,
    canPlaceOrders: false,
    canViewBilling: false,
    canModifyProfile: false
  });

  const validateIC = (icNumber: string): boolean => {
    const icPattern = /^\d{6}-\d{2}-\d{4}$/;
    return icPattern.test(icNumber);
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone || !newContact.email) {
      toast.error("Please fill in required fields");
      return;
    }

    if (newContact.icNumber && !validateIC(newContact.icNumber)) {
      toast.error("Invalid IC number format (YYMMDD-PB-XXXX)");
      return;
    }

    // Check for primary contact limit
    if (newContact.role === "Primary" && contacts.filter(c => c.role === "Primary").length >= 1) {
      toast.error("Only one primary contact is allowed");
      return;
    }

    const contact: ContactPerson = {
      id: `CONT${Date.now()}`,
      name: newContact.name,
      role: newContact.role,
      phone: newContact.phone,
      email: newContact.email,
      icNumber: newContact.icNumber || undefined,
      position: newContact.position || undefined,
      department: newContact.department || undefined,
      isActive: true,
      accessLevel: newContact.accessLevel,
      canPlaceOrders: newContact.canPlaceOrders,
      canViewBilling: newContact.canViewBilling,
      canModifyProfile: newContact.canModifyProfile
    };

    const updatedContacts = [...contacts, contact];
    onContactsUpdate(updatedContacts);
    toast.success("Contact added successfully");
    setShowAddModal(false);
    resetForm();
  };

  const handleEditContact = (contact: ContactPerson) => {
    setEditingContact(contact);
    setNewContact({
      name: contact.name,
      role: contact.role,
      phone: contact.phone,
      email: contact.email,
      icNumber: contact.icNumber || "",
      position: contact.position || "",
      department: contact.department || "",
      accessLevel: contact.accessLevel,
      canPlaceOrders: contact.canPlaceOrders,
      canViewBilling: contact.canViewBilling,
      canModifyProfile: contact.canModifyProfile
    });
    setShowAddModal(true);
  };

  const handleUpdateContact = () => {
    if (!editingContact) return;

    const updatedContacts = contacts.map(contact =>
      contact.id === editingContact.id
        ? {
            ...contact,
            name: newContact.name,
            role: newContact.role,
            phone: newContact.phone,
            email: newContact.email,
            icNumber: newContact.icNumber || undefined,
            position: newContact.position || undefined,
            department: newContact.department || undefined,
            accessLevel: newContact.accessLevel,
            canPlaceOrders: newContact.canPlaceOrders,
            canViewBilling: newContact.canViewBilling,
            canModifyProfile: newContact.canModifyProfile
          }
        : contact
    );

    onContactsUpdate(updatedContacts);
    toast.success("Contact updated successfully");
    setShowAddModal(false);
    setEditingContact(null);
    resetForm();
  };

  const handleDeleteContact = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact?.role === "Primary" && contacts.filter(c => c.role === "Primary").length === 1) {
      toast.error("Cannot delete the only primary contact");
      return;
    }

    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    onContactsUpdate(updatedContacts);
    toast.success("Contact deleted successfully");
  };

  const toggleContactStatus = (contactId: string) => {
    const updatedContacts = contacts.map(contact =>
      contact.id === contactId
        ? { ...contact, isActive: !contact.isActive }
        : contact
    );
    onContactsUpdate(updatedContacts);
  };

  const resetForm = () => {
    setNewContact({
      name: "",
      role: "Secondary",
      phone: "",
      email: "",
      icNumber: "",
      position: "",
      department: "",
      accessLevel: "Limited",
      canPlaceOrders: false,
      canViewBilling: false,
      canModifyProfile: false
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Primary":
        return <Badge className="bg-blue-100 text-blue-800"><Crown className="h-3 w-3 mr-1" />Primary</Badge>;
      case "Secondary":
        return <Badge className="bg-green-100 text-green-800"><User className="h-3 w-3 mr-1" />Secondary</Badge>;
      case "Emergency":
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Emergency</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getAccessBadge = (accessLevel: string) => {
    switch (accessLevel) {
      case "Full":
        return <Badge className="bg-purple-100 text-purple-800"><Shield className="h-3 w-3 mr-1" />Full Access</Badge>;
      case "Limited":
        return <Badge className="bg-yellow-100 text-yellow-800">Limited</Badge>;
      case "View Only":
        return <Badge className="bg-gray-100 text-gray-800">View Only</Badge>;
      default:
        return <Badge variant="secondary">{accessLevel}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Contact Person Hierarchy
            </CardTitle>
            <Dialog open={showAddModal} onOpenChange={(open) => {
              setShowAddModal(open);
              if (!open) {
                setEditingContact(null);
                resetForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingContact ? "Edit Contact Person" : "Add Contact Person"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 space-y-2">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newContact.name}
                      onChange={(e) => setNewContact(prev => ({...prev, name: e.target.value}))}
                      placeholder="Ahmad Rahman"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Contact Role *</Label>
                    <Select value={newContact.role} onValueChange={(value: any) => setNewContact(prev => ({...prev, role: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Primary">Primary Contact</SelectItem>
                        <SelectItem value="Secondary">Secondary Contact</SelectItem>
                        <SelectItem value="Emergency">Emergency Contact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={newContact.phone}
                      onChange={(e) => setNewContact(prev => ({...prev, phone: e.target.value}))}
                      placeholder="+60 12-345 6789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newContact.email}
                      onChange={(e) => setNewContact(prev => ({...prev, email: e.target.value}))}
                      placeholder="ahmad@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="icNumber">IC Number</Label>
                    <Input
                      id="icNumber"
                      value={newContact.icNumber}
                      onChange={(e) => setNewContact(prev => ({...prev, icNumber: e.target.value}))}
                      placeholder="YYMMDD-PB-XXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position/Title</Label>
                    <Input
                      id="position"
                      value={newContact.position}
                      onChange={(e) => setNewContact(prev => ({...prev, position: e.target.value}))}
                      placeholder="Manager"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={newContact.department}
                      onChange={(e) => setNewContact(prev => ({...prev, department: e.target.value}))}
                      placeholder="Operations"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accessLevel">Access Level</Label>
                    <Select value={newContact.accessLevel} onValueChange={(value: any) => setNewContact(prev => ({...prev, accessLevel: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full">Full Access</SelectItem>
                        <SelectItem value="Limited">Limited Access</SelectItem>
                        <SelectItem value="View Only">View Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-2">
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newContact.canPlaceOrders}
                          onChange={(e) => setNewContact(prev => ({...prev, canPlaceOrders: e.target.checked}))}
                        />
                        <span className="text-sm">Place Orders</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newContact.canViewBilling}
                          onChange={(e) => setNewContact(prev => ({...prev, canViewBilling: e.target.checked}))}
                        />
                        <span className="text-sm">View Billing</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newContact.canModifyProfile}
                          onChange={(e) => setNewContact(prev => ({...prev, canModifyProfile: e.target.checked}))}
                        />
                        <span className="text-sm">Modify Profile</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                  <Button 
                    onClick={editingContact ? handleUpdateContact : handleAddContact}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {editingContact ? "Update Contact" : "Add Contact"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className={`p-4 border rounded-lg ${!contact.isActive ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.position} {contact.department && `• ${contact.department}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getRoleBadge(contact.role)}
                    {getAccessBadge(contact.accessLevel)}
                    {!contact.isActive && <Badge variant="secondary">Inactive</Badge>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{contact.email}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2 text-xs">
                    {contact.canPlaceOrders && <Badge variant="outline">Can Place Orders</Badge>}
                    {contact.canViewBilling && <Badge variant="outline">Can View Billing</Badge>}
                    {contact.canModifyProfile && <Badge variant="outline">Can Modify Profile</Badge>}
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleContactStatus(contact.id)}
                    >
                      {contact.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditContact(contact)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {contacts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No contact persons added yet</p>
                <p className="text-sm">Add contact persons to manage customer communications</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPersonManager;
