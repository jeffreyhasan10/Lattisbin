
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
                className="hero-button bg-simatex-purple text-white hover:bg-simatex-purple-dark"
                onClick={() => setSignupModalOpen(true)}
              >
                Sign Up Now
              </Button>
              <Button 
                variant="outline" 
                className="hero-button border-simatex-purple text-simatex-purple hover:bg-simatex-purple hover:text-white"
                onClick={() => setLoginModalOpen(true)}
              >
                Log In
              </Button>
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
              
              {/* Floating card 1 */}
              <div className="absolute -left-10 top-1/4 glass-card p-4 rounded-xl shadow-lg max-w-[250px] animate-float">
                <div className="flex items-center space-x-3">
                  <div className="bg-simatex-purple/20 p-2 rounded-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H21M3 12H21M3 18H21" stroke="#7E69AB" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Smart Tracking</p>
                    <p className="text-xs text-gray-500">Real-time bin monitoring</p>
                  </div>
                </div>
              </div>
              
              {/* Floating card 2 */}
              <div className="absolute -right-5 bottom-10 glass-card p-4 rounded-xl shadow-lg max-w-[250px] animate-float animate-delay-500">
                <div className="flex items-center space-x-3">
                  <div className="bg-simatex-blue/20 p-2 rounded-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#1EAEDB" strokeWidth="2" />
                      <path d="M12 6V12L16 14" stroke="#1EAEDB" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">24/7 Scheduling</p>
                    <p className="text-xs text-gray-500">Book anytime, anywhere</p>
                  </div>
                </div>
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
