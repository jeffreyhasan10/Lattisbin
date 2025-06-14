
import { Facebook, Instagram, Linkedin, Twitter, Youtube, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const FooterSection = () => {
  const currentYear = new Date().getFullYear();
  
  const handleSubscribe = () => {
    toast.success("Thank you for subscribing to our newsletter!");
  };
  
  const handleChatStart = () => {
    toast.info("Live chat feature coming soon!", {
      description: "Our support team will be available via live chat in the near future."
    });
  };

  return (
    <footer className="bg-simatex-purple-dark text-white">
      {/* Chat button - fixed at bottom right */}
      <button
        onClick={handleChatStart}
        className="fixed bottom-6 right-6 z-50 bg-simatex-purple text-white p-3 rounded-full shadow-lg hover:bg-simatex-purple-dark transition-all duration-300"
        aria-label="Start live chat"
      >
        <MessageCircle size={24} />
      </button>

      {/* Main footer content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Lattis</h3>
            <p className="text-gray-300 mb-4">
              Malaysia's premier waste disposal company providing bin management solutions for businesses and communities nationwide.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
              </li>
              <li>
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Services */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="text-gray-300 hover:text-white transition-colors">General Waste Disposal</a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-white transition-colors">Recycling Services</a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-white transition-colors">RoRo Container Rental</a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-white transition-colors">Bulk Trash Collection</a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-white transition-colors">Bin Management System</a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-white transition-colors">Scheduled Collections</a>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Stay updated with our latest news and special offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="p-2 text-gray-800 rounded-l-md w-full focus:outline-none focus:ring-2 focus:ring-simatex-purple"
              />
              <Button 
                className="bg-simatex-purple hover:bg-simatex-purple-light text-white rounded-l-none"
                onClick={handleSubscribe}
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Lattis Bin. All rights reserved. | Proudly Serving Malaysia Since 2010
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
