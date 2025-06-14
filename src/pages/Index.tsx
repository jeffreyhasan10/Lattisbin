
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";
import { useEffect } from "react";

const Index = () => {
  // Add scroll reveal animations using IntersectionObserver
  useEffect(() => {
    const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-fade-in-right, .animate-slide-in-bottom');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
    
    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <FeaturesSection />
        <TestimonialsSection />
        <ContactSection />
        
        {/* Driver Portal Access Section */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Driver Portal</h2>
            <p className="text-lg text-green-700 mb-8">
              Access your mobile dashboard for job management and delivery tracking
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.href = '/driver/login'}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Driver Login Portal
              </button>
            </div>
            <div className="mt-4 text-sm text-green-600">
              <p>Demo: Ahmad Rahman / 920815-14-5678 / 012-3456789</p>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
