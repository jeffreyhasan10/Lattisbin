import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Building2 } from "lucide-react";
import UnifiedLogin from "./UnifiedLogin";
import SignupModal from "./SignupModal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Features", href: "#features" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/20"
            : "bg-white/90 backdrop-blur-sm shadow-sm border-b border-white/20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-display text-navy">
                  Lattis Bin
                </span>
                <span className="text-xs text-gray-600">
                  Waste Management
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="font-medium transition-colors hover:text-blue-600 text-gray-700"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setShowLoginModal(true)}
                className="font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                Login
              </Button>
              <Button
                onClick={() => setShowSignupModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-lg shadow-lg mt-2 border border-gray-100">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-2 space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowLoginModal(true);
                      setIsOpen(false);
                    }}
                    className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      setShowSignupModal(true);
                      setIsOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modals */}
      <UnifiedLogin isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <SignupModal isOpen={showSignupModal} onClose={() => setShowSignupModal(false)} />
    </>
  );
};

export default Navbar;
