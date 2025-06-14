import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Image, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Dummy waste collection data
const DUMMY_COLLECTIONS = [
  {
    id: 1,
    binSN: "ASR100",
    customerName: "Azlan Sdn Bhd",
    collectionDate: "2024-03-10",
    wasteType: "Scrap Metal",
    weight: "850 kg",
    images: ["image1.jpg", "image2.jpg", "image3.jpg"],
    collectedBy: "Ahmad bin Abdullah",
    lorryNumber: "MYB 2345",
    notes: "Customer requested proper segregation of ferrous and non-ferrous materials",
  },
  {
    id: 2,
    binSN: "LSR150",
    customerName: "Eastern Metal Works",
    collectionDate: "2024-03-12",
    wasteType: "Mixed Waste",
    weight: "1200 kg",
    images: ["image4.jpg", "image5.jpg", "image6.jpg"],
    collectedBy: "Tan Wei Ming",
    lorryNumber: "MYC 6789",
    notes: "Includes some hazardous materials that require special handling",
  },
  {
    id: 3,
    binSN: "ASR105",
    customerName: "Johor Construction Co.",
    collectionDate: "2024-03-15",
    wasteType: "Construction Waste",
    weight: "1500 kg",
    images: ["image7.jpg", "image8.jpg", "image9.jpg"],
    collectedBy: "Mohammad Zulkifli",
    lorryNumber: "MYE 5678",
    notes: "Large pieces of concrete and metal rebars",
  },
  {
    id: 4,
    binSN: "LSR150",
    customerName: "Eastern Metal Works",
    collectionDate: "2024-03-20",
    wasteType: "Plastic Waste",
    weight: "350 kg",
    images: ["image10.jpg", "image11.jpg", "image12.jpg"],
    collectedBy: "Tan Wei Ming",
    lorryNumber: "MYC 6789",
    notes: "Mostly HDPE plastics for recycling",
  },
];

// Waste type options
const WASTE_TYPES = ["Scrap Metal", "Plastic Waste", "Construction Waste", "Mixed Waste"];

const WasteCollection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [collections, setCollections] = useState(DUMMY_COLLECTIONS);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addCollectionForm, setAddCollectionForm] = useState({
    binSN: "",
    customerName: "",
    collectionDate: "",
    wasteType: "",
    weight: "",
    images: [],
    collectedBy: "",
    lorryNumber: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Filter collections
  const filteredCollections = collections.filter(
    (collection) =>
      collection.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.binSN.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.wasteType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Waste type badge color
  const getWasteTypeColor = (type) => {
    switch (type) {
      case "Scrap Metal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Plastic Waste":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      case "Construction Waste":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "Mixed Waste":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Handle view details
  const handleViewDetails = (collection) => {
    setSelectedCollection(collection);
    setIsDetailsModalOpen(true);
  };

  // Validate add collection form
  const validateAddCollectionForm = () => {
    const errors = {};
    if (!addCollectionForm.binSN.trim()) errors.binSN = "Bin serial is required";
    if (!addCollectionForm.customerName.trim()) errors.customerName = "Customer name is required";
    if (!addCollectionForm.collectionDate) errors.collectionDate = "Collection date is required";
    if (!addCollectionForm.wasteType) errors.wasteType = "Waste type is required";
    if (!addCollectionForm.weight || parseFloat(addCollectionForm.weight) <= 0)
      errors.weight = "Valid weight is required";
    if (!addCollectionForm.collectedBy.trim()) errors.collectedBy = "Collected by is required";
    if (!addCollectionForm.lorryNumber.trim()) errors.lorryNumber = "Lorry number is required";
    return errors;
  };

  // Handle input changes for new collection
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddCollectionForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes for waste type
  const handleSelectChange = (value) => {
    setAddCollectionForm((prev) => ({ ...prev, wasteType: value }));
  };

  // Handle file input for images
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).map((file) => file.name); // Mock file names for demo
    setAddCollectionForm((prev) => ({ ...prev, images: files }));
  };

  // Handle form submission
  const handleAddCollection = () => {
    const errors = validateAddCollectionForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newId = Math.max(...collections.map((c) => c.id), 0) + 1;
    setCollections((prev) => [
      ...prev,
      {
        ...addCollectionForm,
        id: newId,
        weight: `${addCollectionForm.weight} kg`,
      },
    ]);

    // Reset form and close modal
    setAddCollectionForm({
      binSN: "",
      customerName: "",
      collectionDate: "",
      wasteType: "",
      weight: "",
      images: [],
      collectedBy: "",
      lorryNumber: "",
      notes: "",
    });
    setFormErrors({});
    setIsAddModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Waste Collection
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Track and manage waste collection records
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search collections by customer, bin, or waste type..."
              className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-5 w-5" /> Add Collection
          </Button>
        </div>
      </div>

      {/* Collection Table */}
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 pb-4 pt-6">
          <CardTitle className="text-white text-2xl font-bold flex items-center gap-3 tracking-tight">
            <Image className="h-6 w-6" />
            Collection Records
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <Badge
              variant="outline"
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-lg px-4 py-1 rounded-full"
            >
              {filteredCollections.length} Collections
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Date</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Customer & Bin</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Waste Type</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Weight</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Collected By</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Images</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredCollections.length > 0 ? (
                    filteredCollections.map((collection) => (
                      <motion.tr
                        key={collection.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                          {new Date(collection.collectionDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {collection.customerName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Bin: {collection.binSN}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getWasteTypeColor(collection.wasteType)} rounded-full px-3 py-1 font-medium`}>
                            {collection.wasteType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                          {collection.weight}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            {collection.collectedBy}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Lorry: {collection.lorryNumber}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 font-medium">
                              {collection.images.length} Images
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                            >
                              View
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                              onClick={() => handleViewDetails(collection)}
                            >
                              Details
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                            >
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center py-8">
                          <Image className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                            No collections found
                          </p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                            Try adjusting your search criteria or add a new collection.
                          </p>
                        </div>
                      </TableCell>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog
        open={isDetailsModalOpen}
        onOpenChange={(open) => {
          setIsDetailsModalOpen(open);
          if (!open) setSelectedCollection(null);
        }}
      >
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Image className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Collection Details
            </DialogTitle>
          </DialogHeader>
          {selectedCollection && (
            <div className="grid gap-5 py-6 px-2">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Customer Name
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                  {selectedCollection.customerName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bin Serial
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                  {selectedCollection.binSN}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Collection Date
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                  {new Date(selectedCollection.collectionDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-5

00 dark:text-gray-400">Waste Type</label>
                <Badge
                  className={`mt-1 ${getWasteTypeColor(selectedCollection.wasteType)} rounded-full px-3 py-1 font-medium`}
                >
                  {selectedCollection.wasteType}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Weight</label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                  {selectedCollection.weight}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Collected By
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                  {selectedCollection.collectedBy}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Lorry Number
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 font-medium">
                  {selectedCollection.lorryNumber}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</label>
                <p className="mt-1 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  {selectedCollection.notes || "No notes available"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Images</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCollection.images.length > 0 ? (
                    selectedCollection.images.map((image, index) => (
                      <Badge
                        key={index}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 font-medium"
                      >
                        {image}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No images available</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300"
              onClick={() => setIsDetailsModalOpen(false)}
            >
              Close
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Edit Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Collection Modal */}
      <Dialog
        open={isAddModalOpen}
        onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if (!open) {
            setAddCollectionForm({
              binSN: "",
              customerName: "",
              collectionDate: "",
              wasteType: "",
              weight: "",
              images: [],
              collectedBy: "",
              lorryNumber: "",
              notes: "",
            });
            setFormErrors({});
          }
        }}
      >
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />
              Add New Collection
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-6 px-2">
            <div className="relative">
              <Input
                name="binSN"
                value={addCollectionForm.binSN}
                onChange={handleInputChange}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Bin Serial
              </label>
              {formErrors.binSN && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.binSN}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                name="customerName"
                value={addCollectionForm.customerName}
                onChange={handleInputChange}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Customer Name
              </label>
              {formErrors.customerName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.customerName}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                type="date"
                name="collectionDate"
                value={addCollectionForm.collectionDate}
                onChange={handleInputChange}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Collection Date
              </label>
              {formErrors.collectionDate && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.collectionDate}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Select value={addCollectionForm.wasteType} onValueChange={handleSelectChange}>
                <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300">
                  <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <SelectValue placeholder="Select waste type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700">
                  {WASTE_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.wasteType && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.wasteType}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                type="number"
                name="weight"
                value={addCollectionForm.weight}
                onChange={handleInputChange}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Weight (kg)
              </label>
              {formErrors.weight && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.weight}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                name="collectedBy"
                value={addCollectionForm.collectedBy}
                onChange={handleInputChange}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Collected By
              </label>
              {formErrors.collectedBy && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.collectedBy}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Input
                name="lorryNumber"
                value={addCollectionForm.lorryNumber}
                onChange={handleInputChange}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Lorry Number
              </label>
              {formErrors.lorryNumber && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" /> {formErrors.lorryNumber}
                </motion.p>
              )}
            </div>
            <div className="relative">
              <Textarea
                name="notes"
                value={addCollectionForm.notes}
                onChange={handleInputChange}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 pt-4 h-24 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Image className="absolute left-3 top-4 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-4 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Notes
              </label>
            </div>
            <div className="relative">
              <Input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 h-12 focus:ring-2 focus:ring-green-500 transition-all duration-300 peer"
                placeholder=" "
              />
              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <label className="absolute left-10 top-0 text-gray-500 dark:text-gray-400 text-sm transform -translate-y-2 scale-75 origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300">
                Images
              </label>
              {addCollectionForm.images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {addCollectionForm.images.map((image, index) => (
                    <Badge
                      key={index}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 font-medium"
                    >
                      {image}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={handleAddCollection}
            >
              Add Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default WasteCollection;