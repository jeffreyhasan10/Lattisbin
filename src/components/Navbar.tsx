
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center">
              <span className="text-2xl font-display font-bold text-simatex-purple-dark">
                Lattis<span className="text-simatex-purple">.</span>
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-simatex-purple font-medium">
                Home
              </a>
              <a href="#about" className="text-gray-700 hover:text-simatex-purple font-medium">
                About
              </a>
              <a href="#services" className="text-gray-700 hover:text-simatex-purple font-medium">
                Services
              </a>
              <a href="#features" className="text-gray-700 hover:text-simatex-purple font-medium">
                Features
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-simatex-purple font-medium">
                Testimonials
              </a>
              <a href="#contact" className="text-gray-700 hover:text-simatex-purple font-medium">
                Contact
              </a>
            </div>
          </div>

          {/* Login/Signup Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="border-simatex-purple text-simatex-purple hover:bg-simatex-purple hover:text-white"
              onClick={() => setLoginModalOpen(true)}
            >
              Log In
            </Button>
            <Button 
              className="bg-simatex-purple text-white hover:bg-simatex-purple-dark"
              onClick={() => setSignupModalOpen(true)}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-simatex-purple"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a 
              href="#home" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-simatex-purple"
              onClick={() => setIsOpen(false)}
            >
              Home
            </a>
            <a 
              href="#about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-simatex-purple"
              onClick={() => setIsOpen(false)}
            >
              About
            </a>
            <a 
              href="#services" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-simatex-purple"
              onClick={() => setIsOpen(false)}
            >
              Services
            </a>
            <a 
              href="#features" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-simatex-purple"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            <a 
              href="#testimonials" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-simatex-purple"
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </a>
            <a 
              href="#contact" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-simatex-purple"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-100">
            <div className="flex items-center px-5">
              <Button 
                variant="outline" 
                className="w-1/2 mr-2 border-simatex-purple text-simatex-purple hover:bg-simatex-purple hover:text-white"
                onClick={() => {
                  setLoginModalOpen(true);
                  setIsOpen(false);
                }}
              >
                Log In
              </Button>
              <Button 
                className="w-1/2 bg-simatex-purple text-white hover:bg-simatex-purple-dark"
                onClick={() => {
                  setSignupModalOpen(true);
                  setIsOpen(false);
                }}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Login/Signup Modals */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <SignupModal isOpen={signupModalOpen} onClose={() => setSignupModalOpen(false)} />
    </nav>
  );
};

export default Navbar;
