import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Camera, AlertCircle, CheckCircle, Tag, DollarSign, Package2, Trash2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

const InventoryRegister = () => {
  const [formData, setFormData] = useState({
    serialNumber: "",
    binSize: "",
    openPrice: "",
    condition: "new",
    images: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const binSizes = [
    "2ft (H) x 12ft (L) x 6ft (W)",
    "4ft (H) x 12ft (L) x 6ft (W)",
    "4ft (H) x 14ft (L) x 6ft (W)",
    "5ft (H) x 12ft (L) x 6ft (W)",
    "6ft (H) x 24ft (L) x 8ft (W)",
    "6.5ft (H) x 14.5ft (L) x 6ft (W)",
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.serialNumber || !/^(ASR|LASR|PWD)\d+$/.test(formData.serialNumber))
      newErrors.serialNumber = "Serial number must start with ASR, LASR, or PWD followed by numbers";
    if (!formData.binSize) newErrors.binSize = "Bin size is required";
    if (!formData.openPrice || isNaN(formData.openPrice) || formData.openPrice <= 0)
      newErrors.openPrice = "Valid rental price is required";
    if (!formData.condition) newErrors.condition = "Condition is required";
    if (formData.images.length !== 3) newErrors.images = "Exactly 3 images are required";
    formData.images.forEach((img, index) => {
      if (img && !["image/png", "image/jpeg"].includes(img.type))
        newErrors[`image${index}`] = `Image ${index + 1} must be PNG or JPEG`;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length <= 3) {
      setFormData((prev) => ({ ...prev, images: files }));
      setErrors((prev) => ({ ...prev, images: null }));
    } else {
      setErrors((prev) => ({ ...prev, images: "Maximum 3 images allowed" }));
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo(0, 0);
      return;
    }
    setIsSubmitting(true);
    try {
      const qrCodeData = `Bin: ${formData.serialNumber}, Size: ${formData.binSize}, Condition: ${formData.condition}`;
      setTimeout(() => {
        setQrCodeValue(qrCodeData);
        setIsSuccess(true);
        setIsSubmitting(false);
        setFormData({
          serialNumber: "",
          binSize: "",
          openPrice: "",
          condition: "new",
          images: [],
        });
        setErrors({});
      }, 1500);
    } catch (error) {
      console.error("Error submitting bin data:", error);
      setErrors({ submit: "Failed to register bin. Please try again." });
      setIsSubmitting(false);
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case "new": return "text-emerald-800 bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300";
      case "used": return "text-amber-800 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300";
      case "damaged": return "text-red-800 bg-red-100 dark:bg-red-900/20 dark:text-red-300";
      default: return "text-blue-800 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-4">
      <Card className="max-w-2xl mx-auto shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden rounded-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/15 p-3 rounded-lg backdrop-blur-sm">
              <Package2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                Register New Bin
              </CardTitle>
              <CardDescription className="text-blue-100 mt-1 text-base">
                Add a new storage bin to the inventory system
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8 px-8 pb-8 bg-white dark:bg-gray-800">
          {isSuccess ? (
            <div className="space-y-8">
              <div className="flex items-center justify-center gap-3 text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/20 p-5 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                <CheckCircle className="h-6 w-6" />
                <span className="font-medium text-lg">Bin registered successfully!</span>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                  <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Bin QR Code
                </h3>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                    <QRCodeCanvas value={qrCodeValue} size={180} />
                  </div>
                  <div className="space-y-5 flex-1">
                    <p className="text-gray-700 dark:text-gray-300">
                      Scan this QR code to access complete bin details. This code contains basic identification information about the bin.
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500 dark:text-gray-400">QR Code Data:</div>
                      <code className="block bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-700 text-sm overflow-x-auto">{qrCodeValue}</code>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2 px-5 py-2 rounded-lg shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download QR Code
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between gap-4 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-2.5"
                  onClick={() => {
                    setIsSuccess(false);
                    setQrCodeValue(null);
                  }}
                >
                  Register Another Bin
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 shadow-sm">
                  View All Bins
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Serial Number Field */}
                <div className="space-y-2">
                  <Label htmlFor="serialNumber" className="text-gray-700 dark:text-gray-300 flex items-center gap-2 font-medium">
                    <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Serial Number
                  </Label>
                  <Input
                    id="serialNumber"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    className={`border ${errors.serialNumber ? "border-red-300 dark:border-red-700" : "border-gray-200 dark:border-gray-700"} focus:border-blue-500 focus:ring focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white h-11 rounded-lg`}
                    placeholder="e.g., ASR100"
                  />
                  {errors.serialNumber && (
                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.serialNumber}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Must start with ASR, LASR, or PWD followed by numbers
                  </p>
                </div>

                {/* Condition Field */}
                <div className="space-y-2">
                  <Label htmlFor="condition" className="text-gray-700 dark:text-gray-300 flex items-center gap-2 font-medium">
                    <Package2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Condition
                  </Label>
                  <Select
                    name="condition"
                    value={formData.condition}
                    onValueChange={(value) => handleSelectChange("condition", value)}
                  >
                    <SelectTrigger className={`border ${errors.condition ? "border-red-300 dark:border-red-700" : "border-gray-200 dark:border-gray-700"} focus:ring focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white h-11 rounded-lg`}>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg">
                      <SelectItem value="new" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div className="flex items-center">
                          <span className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></span>
                          New
                        </div>
                      </SelectItem>
                      <SelectItem value="used" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div className="flex items-center">
                          <span className="h-3 w-3 rounded-full bg-amber-500 mr-2"></span>
                          Used
                        </div>
                      </SelectItem>
                      <SelectItem value="damaged" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div className="flex items-center">
                          <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                          Damaged
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.condition && (
                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.condition}
                    </p>
                  )}
                </div>
              </div>

              {/* Bin Size Field */}
              <div className="space-y-2">
                <Label htmlFor="binSize" className="text-gray-700 dark:text-gray-300 flex items-center gap-2 font-medium">
                  <Package2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Bin Size
                </Label>
                <Select
                  name="binSize"
                  value={formData.binSize}
                  onValueChange={(value) => handleSelectChange("binSize", value)}
                >
                  <SelectTrigger className={`border ${errors.binSize ? "border-red-300 dark:border-red-700" : "border-gray-200 dark:border-gray-700"} focus:ring focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white h-11 rounded-lg`}>
                    <SelectValue placeholder="Select bin dimensions" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg">
                    {binSizes.map((size) => (
                      <SelectItem key={size} value={size} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.binSize && (
                  <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.binSize}
                  </p>
                )}
              </div>

              {/* Rental Price Field */}
              <div className="space-y-2">
                <Label htmlFor="openPrice" className="text-gray-700 dark:text-gray-300 flex items-center gap-2 font-medium">
                  <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Rental Price
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">$</span>
                  </div>
                  <Input
                    id="openPrice"
                    name="openPrice"
                    type="number"
                    value={formData.openPrice}
                    onChange={handleChange}
                    className={`pl-8 border ${errors.openPrice ? "border-red-300 dark:border-red-700" : "border-gray-200 dark:border-gray-700"} focus:border-blue-500 focus:ring focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white h-11 rounded-lg`}
                    placeholder="Enter rental price"
                  />
                </div>
                {errors.openPrice && (
                  <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.openPrice}
                  </p>
                )}
              </div>

              {/* Images Field */}
              <div className="space-y-3 pt-2">
                <Label htmlFor="images" className="text-gray-700 dark:text-gray-300 flex items-center gap-2 font-medium">
                  <Camera className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Bin Images (Exactly 3)
                </Label>
                <Input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/png,image/jpeg"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className={`w-full border-dashed border-2 ${errors.images ? "border-red-300 dark:border-red-700" : "border-gray-300 dark:border-gray-600"} bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 py-8 rounded-xl`}
                    onClick={() => document.getElementById("images").click()}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-full">
                        <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium">Drag and drop or click to upload</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">PNG or JPEG files (3 images required)</span>
                    </div>
                  </Button>
                  
                  {formData.images.length > 0 && (
                    <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          <Camera className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          Selected Images
                        </h4>
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${formData.images.length === 3 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"}`}>
                          {formData.images.length}/3
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {formData.images.map((img, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                          >
                            <div className="flex items-center overflow-hidden">
                              <div className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full h-7 w-7 flex-shrink-0 mr-3">
                                {index + 1}
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                {img.name}
                              </span>
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                              onClick={() => removeImage(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {errors.images && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.images}
                    </p>
                  )}
                </div>
              </div>
              
              {errors.submit && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 rounded-lg flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                  <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
                </div>
              )}
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-lg transition-colors shadow-sm mt-4"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Registering Bin...</span>
                  </div>
                ) : (
                  "Register Bin"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryRegister;