
import { Trash2, TruckIcon, Recycle, Database } from "lucide-react";
import { useState } from "react";

interface BinSize {
  name: string;
  dimensions: string;
  capacity: string;
  bestFor: string;
}

const ServicesSection = () => {
  const [selectedBin, setSelectedBin] = useState<BinSize | null>(null);
  
  const binSizes: BinSize[] = [
    {
      name: "4 Yard",
      dimensions: "10 ft x 2 ft x 5.5 ft",
      capacity: "1,500 lbs",
      bestFor: "Small businesses, residential projects"
    },
    {
      name: "10 Yard",
      dimensions: "10 ft x 4 ft x 6.5 ft",
      capacity: "2,200 lbs",
      bestFor: "Medium renovation projects, small cleanouts"
    },
    {
      name: "15 Yard",
      dimensions: "10.5 ft x 5 ft x 7 ft",
      capacity: "2,700 lbs",
      bestFor: "Construction debris, commercial use"
    },
    {
      name: "20 Yard",
      dimensions: "11 ft x 6 ft x 8 ft",
      capacity: "3,040 lbs",
      bestFor: "Large renovations, industrial waste"
    }
  ];

  const services = [
    {
      icon: <Trash2 size={40} className="text-simatex-purple" />,
      title: "General Waste",
      description: "Comprehensive disposal solutions for all types of general waste with same-day collection options."
    },
    {
      icon: <Recycle size={40} className="text-simatex-purple" />,
      title: "Recycling Services",
      description: "Specialized collection for plastics, scrap metal, and other recyclable materials."
    },
    {
      icon: <TruckIcon size={40} className="text-simatex-purple" />,
      title: "RoRo Containers",
      description: "Roll-on/roll-off container services for larger waste management projects."
    },
    {
      icon: <Database size={40} className="text-simatex-purple" />,
      title: "Bulk Trash",
      description: "Efficient removal of large items and bulk waste for residential and commercial clients."
    }
  ];

  return (
    <section id="services" className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our <span className="text-gradient">Services</span></h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Comprehensive waste management solutions tailored to meet your specific needs with the latest technology.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="service-card opacity-0 animate-fade-in" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-700">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Bin Sizes */}
        <div className="bg-gray-50 rounded-3xl p-6 lg:p-10 opacity-0 animate-fade-in animate-delay-300">
          <h3 className="text-2xl font-semibold mb-6 text-center">Available Bin Sizes</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {binSizes.map((bin, index) => (
              <div 
                key={index}
                className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  selectedBin?.name === bin.name 
                  ? 'border-simatex-purple bg-simatex-purple/5 shadow-md' 
                  : 'border-gray-200 hover:border-simatex-purple/50'
                }`}
                onClick={() => setSelectedBin(bin)}
              >
                <div className="text-center">
                  <h4 className="text-lg font-semibold">{bin.name}</h4>
                  <p className="text-sm text-gray-600">{bin.dimensions}</p>
                </div>
              </div>
            ))}
          </div>
          
          {selectedBin && (
            <div className="mt-8 bg-white rounded-xl p-6 shadow-md animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                  <h4 className="text-xl font-semibold text-simatex-purple">{selectedBin.name} Bin</h4>
                  <p className="text-gray-700">Dimensions: {selectedBin.dimensions}</p>
                  <p className="text-gray-700">Capacity: {selectedBin.capacity}</p>
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
