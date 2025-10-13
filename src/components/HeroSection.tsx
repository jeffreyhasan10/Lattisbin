
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

const HeroSection = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  return (
    <section id="home" className="relative pt-28 pb-24 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-40 right-0 w-96 h-96 bg-simatex-purple/10 rounded-full filter blur-3xl animate-pulse-light"></div>
      <div className="absolute bottom-0 left-20 w-72 h-72 bg-simatex-blue/10 rounded-full filter blur-3xl animate-pulse-light"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left column with text */}
          <div className="lg:w-1/2 lg:pr-10 mb-12 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in">
              Transforming Waste Management with{" "}
              <span className="text-gradient">Lattis Bin</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 animate-fade-in animate-delay-200">
              Malaysia’s trusted bin management platform for businesses and communities. 
              From recycling to bulk waste, we deliver fast, reliable and sustainable service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animate-delay-300">

              <Button 
                variant="ghost" 
                className="hero-button text-gray-700 hover:text-simatex-purple"
                onClick={() => {
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Our Services
              </Button>
            </div>
          </div>
          
          {/* Right column with image */}
          <div className="lg:w-1/2">
            <div className="relative">
              {/* Main image */}
              <div className="rounded-2xl overflow-hidden shadow-xl animate-fade-in animate-delay-200">
                <img
                  src="/assets/lattis2.jpg" 
                  alt="Lattis Bin Management System preview"
                  className="w-full h-auto"
                />
              </div>
              
             
             
            </div>
          </div>
        </div>
        
        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button 
            onClick={() => {
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center text-gray-500 hover:text-simatex-purple"
          >
            <span className="text-sm mb-1">Learn More</span>
            <ChevronDown size={20} />
          </button>
        </div>
      </div>
      
      {/* Login/Signup Modals */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <SignupModal isOpen={signupModalOpen} onClose={() => setSignupModalOpen(false)} />
    </section>
  );
};

export default HeroSection;
