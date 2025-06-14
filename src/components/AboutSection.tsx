
import { BadgeCheck, MapPin, Phone, Mail, Building } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">About <span className="text-gradient">Lattis</span></h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Malaysia's premier waste disposal company, providing innovative bin management solutions for businesses and communities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left column with image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img 
                src="./assets/lattis1.jpg" 
                alt="Simatex Company Building" 
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-lg p-4 shadow-lg">
              <p className="font-semibold text-simatex-purple-dark">Proudly Serving Malaysia Since 2010</p>
            </div>
          </div>

          {/* Right column with text */}
          <div className="space-y-6">
            <div className="opacity-0 animate-fade-in">
              <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To revolutionize waste management in Malaysia through technology-driven solutions that promote sustainability, reliability, and innovation. We aim to reduce environmental impact while providing unparalleled service to our clients.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 opacity-0 animate-fade-in animate-delay-200">
              <h3 className="text-2xl font-semibold mb-4">Company Details</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Building className="w-5 h-5 text-simatex-purple mr-3" />
                  <span>Lattis Bin</span>
                </li>
                <li className="flex items-center">
                  <BadgeCheck className="w-5 h-5 text-simatex-purple mr-3" />
                  <span>Registration No: 201001234567</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="w-5 h-5 text-simatex-purple mr-3" />
                  <span>123 Jalan Ampang, 50450 Kuala Lumpur, Malaysia</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 text-simatex-purple mr-3" />
                  <span>+60 3-2345 6789</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 text-simatex-purple mr-3" />
                  <span>info@lattisbin.com.my</span>
                </li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6 opacity-0 animate-fade-in animate-delay-300">
              <div className="flex flex-wrap gap-3">
                <span className="bg-simatex-purple/10 text-simatex-purple rounded-full px-3 py-1 text-sm">Malaysian Owned</span>
                <span className="bg-simatex-purple/10 text-simatex-purple rounded-full px-3 py-1 text-sm">Sustainable Practices</span>
                <span className="bg-simatex-purple/10 text-simatex-purple rounded-full px-3 py-1 text-sm">Nationwide Service</span>
                <span className="bg-simatex-purple/10 text-simatex-purple rounded-full px-3 py-1 text-sm">GST Registered</span>
                <span className="bg-simatex-purple/10 text-simatex-purple rounded-full px-3 py-1 text-sm">ISO Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
