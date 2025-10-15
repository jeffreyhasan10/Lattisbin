
import { Trash2, TruckIcon, Recycle, Database, MapPin, PhoneCall } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface BinSize {
  name: string;
  dimensions: string;
  capacity: string;
  bestFor: string;
  approxWeight?: string;
  totalVolume?: string;
}

const ServicesSection = () => {
  const [selectedBin, setSelectedBin] = useState<BinSize | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const binSizes: BinSize[] = [
    {
      name: "Small Bin",
      approxWeight: "1,000lbs",
      dimensions: "2 ft x 12 ft x 6 ft",
      totalVolume: "144 Cubic Feet",
      capacity: "1,000 lbs",
      bestFor: "Small businesses, residential cleanup",
    },
    {
      name: "Medium Bin",
      approxWeight: "1,800lbs",
      dimensions: "4 ft x 12 ft x 6 ft",
      totalVolume: "288 Cubic Feet",
      capacity: "1,800 lbs",
      bestFor: "Shops, cafes, modest renovations",
    },
    {
      name: "Large Bin",
      approxWeight: "2,500lbs",
      dimensions: "5 ft x 12 ft x 6 ft",
      totalVolume: "360 Cubic Feet",
      capacity: "2,500 lbs",
      bestFor: "Medium renovation projects, office cleanouts",
    },
    {
      name: "Extra Large Bin",
      approxWeight: "3,200lbs",
      dimensions: "6 ft x 12 ft x 6 ft",
      totalVolume: "432 Cubic Feet",
      capacity: "3,200 lbs",
      bestFor: "Construction debris, commercial use",
    },
    {
      name: "Jumbo Bin",
      approxWeight: "4,500lbs",
      dimensions: "6 ft x 24 ft x 8 ft",
      totalVolume: "1,152 Cubic Feet",
      capacity: "4,500 lbs",
      bestFor: "Large renovations, industrial waste",
    },
    {
      name: "Wide Load Bin",
      approxWeight: "2,200lbs",
      dimensions: "2 ft x 20 ft x 8 ft",
      totalVolume: "320 Cubic Feet",
      capacity: "2,200 lbs",
      bestFor: "Long materials, construction debris",
    },
  ];

  const serviceLocations = useMemo(
    () => [
      "Kuala Lumpur",
      "Petaling Jaya",
      "Shah Alam",
      "Subang Jaya",
      "Putrajaya",
      "Cyberjaya",
      "George Town (Penang)",
      "Ipoh",
      "Johor Bahru",
      "Melaka",
      "Seremban",
      "Kota Kinabalu",
      "Kuching",
    ],
    []
  );

  const buildWhatsAppUrl = (bin: BinSize, location?: string | null) => {
    const targetNumber = "82202323"; // Given number
    const message = `Hello, I'd like to book a bin.\n\nBin: ${bin.name}\nDimensions: ${bin.dimensions}${
      bin.approxWeight ? `\nApprox. Weight: ${bin.approxWeight}` : ""
    }${bin.totalVolume ? `\nTotal Volume: ${bin.totalVolume}` : ""}${
      location ? `\nPreferred Service Location: ${location}` : ""
    }\n\nPlease advise on availability and pricing.`;
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${targetNumber}?text=${encoded}`;
  };

  const handleBinClick = (bin: BinSize) => {
    setSelectedBin(bin);
    const url = buildWhatsAppUrl(bin, selectedLocation);
    window.open(url, "_blank");
  };

  const services = [
    {
      icon: <Trash2 size={40} className="text-simatex-purple" />,
      title: "General Waste",
      description: "Comprehensive disposal solutions for all types of general waste with same-day collection options.",
    },
    {
      icon: <Recycle size={40} className="text-simatex-purple" />,
      title: "Recycling Services",
      description: "Specialized collection for plastics, scrap metal, and other recyclable materials.",
    },
    {
      icon: <TruckIcon size={40} className="text-simatex-purple" />,
      title: "RoRo Containers",
      description: "Roll-on/roll-off container services for larger waste management projects.",
    },
    {
      icon: <Database size={40} className="text-simatex-purple" />,
      title: "Bulk Trash",
      description: "Efficient removal of large items and bulk waste for residential and commercial clients.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our <span className="text-gradient">Services</span></h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive waste management solutions tailored to meet your specific needs with the latest technology.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              onClick={() => setIsLocationModalOpen(true)}
              variant="outline"
              className="border-simatex-purple text-simatex-purple hover:bg-simatex-purple/10"
            >
              <MapPin className="mr-2 h-4 w-4" /> Choose Service Location
            </Button>
            {selectedLocation && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-simatex-purple/10 text-simatex-purple text-sm">
                <MapPin className="mr-1 h-4 w-4" /> {selectedLocation}
              </span>
            )}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200/50 transition-all duration-300 hover:-translate-y-1 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Bin Sizes */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-3xl p-8 lg:p-12 opacity-0 animate-fade-in animate-delay-500">
          <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">Available Bin Sizes</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {binSizes.map((bin, index) => (
              <div
                key={index}
                className={`group bg-white border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  selectedBin?.name === bin.name
                    ? "border-blue-500 bg-blue-50/50 shadow-lg"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => handleBinClick(bin)}
              >
                <div className="text-center">
                  <h4 className="text-lg font-semibold">{bin.name}</h4>
                  <p className="text-sm text-gray-600">{bin.dimensions}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {bin.approxWeight && <p>Approx. Weight: {bin.approxWeight}</p>}
                    {bin.totalVolume && <p>Volume: {bin.totalVolume}</p>}
                  </div>
                  <div className="mt-3 inline-flex items-center text-simatex-purple text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <PhoneCall className="h-4 w-4 mr-1" /> Book via WhatsApp
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedBin && (
            <div className="mt-8 bg-white rounded-xl p-6 shadow-md animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                  <h4 className="text-xl font-semibold text-simatex-purple">{selectedBin.name}</h4>
                  <p className="text-gray-700">Dimensions: {selectedBin.dimensions}</p>
                  {selectedBin.approxWeight && (
                    <p className="text-gray-700">Approx. Weight: {selectedBin.approxWeight}</p>
                  )}
                  {selectedBin.totalVolume && (
                    <p className="text-gray-700">Total Volume: {selectedBin.totalVolume}</p>
                  )}
                  <p className="text-gray-700">Best for: {selectedBin.bestFor}</p>
                </div>
                <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 aspect-square">
                  <div className="relative w-40 h-40">
                    {/* Simple bin illustration */}
                    <div className="absolute inset-0 border-4 border-simatex-purple/30 rounded perspective-[800px]" style={{ transform: "rotateX(10deg)" }}>
                      <div className="absolute top-0 left-0 right-0 h-5 bg-simatex-purple/20"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  className="bg-simatex-purple hover:bg-simatex-purple-dark"
                  onClick={() => window.open(buildWhatsAppUrl(selectedBin, selectedLocation), "_blank")}
                >
                  <PhoneCall className="mr-2 h-4 w-4" /> Book {selectedBin.name} via WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="border-simatex-purple text-simatex-purple hover:bg-simatex-purple/10"
                  onClick={() => setIsLocationModalOpen(true)}
                >
                  <MapPin className="mr-2 h-4 w-4" /> {selectedLocation ? `Change Location (${selectedLocation})` : "Choose Service Location"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Service Location Modal */}
      <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Select Service Location</DialogTitle>
            <DialogDescription>
              Choose from popular areas in Malaysia. We service additional locations on request.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {serviceLocations.map((loc) => (
              <button
                key={loc}
                className={`text-left border rounded-lg p-3 hover:border-simatex-purple hover:bg-simatex-purple/5 transition-colors ${
                  selectedLocation === loc ? "border-simatex-purple bg-simatex-purple/10" : "border-gray-200"
                }`}
                onClick={() => {
                  setSelectedLocation(loc);
                  setIsLocationModalOpen(false);
                }}
              >
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-simatex-purple" />
                  <div>
                    <p className="font-medium">{loc}</p>
                    <p className="text-xs text-gray-500">Malaysia</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ServicesSection;
