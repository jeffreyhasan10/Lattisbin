
import { BadgeCheck, MapPin, Phone, Mail, Building } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">About <span className="text-gradient">Lattis</span></h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Malaysia's premier waste disposal company, providing innovative bin management solutions for businesses and communities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column with image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img 
                src="/assets/lattis1.jpg" 
                alt="Lattis company building" 
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <p className="font-bold text-blue-600 text-lg">Proudly Serving Malaysia Since 2010</p>
            </div>
          </div>

          {/* Right column with text */}
          <div className="space-y-8">
            <div className="opacity-0 animate-fade-in">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To revolutionize waste management in Malaysia through technology-driven solutions that promote sustainability, reliability, and innovation. We aim to reduce environmental impact while providing unparalleled service to our clients.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-8 opacity-0 animate-fade-in animate-delay-200">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Company Details</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Building className="w-5 h-5 text-blue-600 mr-4" />
                  <span className="text-gray-700">Lattis Bin</span>
                </li>
                <li className="flex items-center">
                  <BadgeCheck className="w-5 h-5 text-blue-600 mr-4" />
                  <span className="text-gray-700">Registration No: 201001234567</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="w-5 h-5 text-blue-600 mr-4" />
                  <span className="text-gray-700">123 Jalan Ampang, 50450 Kuala Lumpur, Malaysia</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 text-blue-600 mr-4" />
                  <span className="text-gray-700">+60 3-2345 6789</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-4" />
                  <span className="text-gray-700">info@lattisbin.com.my</span>
                </li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-8 opacity-0 animate-fade-in animate-delay-300">
              <div className="flex flex-wrap gap-3">
                <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full px-4 py-2 text-sm font-medium">Malaysian Owned</span>
                <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full px-4 py-2 text-sm font-medium">Sustainable Practices</span>
                <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full px-4 py-2 text-sm font-medium">Nationwide Service</span>
                <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full px-4 py-2 text-sm font-medium">GST Registered</span>
                <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full px-4 py-2 text-sm font-medium">ISO Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
