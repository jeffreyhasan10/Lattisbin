
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  name: string;
  position: string;
  company: string;
  quote: string;
  rating: number;
  image?: string;
}

const TestimonialsSection = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Ahmad Razali",
      position: "Operations Manager",
      company: "MalTech Industries",
      quote: "The bin management system has revolutionized our waste disposal processes. The tracking features save us hours each week, and the customer service is excellent.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Siti Noraini",
      position: "Site Supervisor",
      company: "KL Construction Group",
      quote: "As a construction company, we need reliable waste management. Lattis delivers consistently with their innovative tracking system and punctual service.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Raj Kumar",
      position: "Facility Director",
      company: "Penang Heights Hotel",
      quote: "Our hotel requires discreet and efficient waste management. Lattis provides exceptional service with their online booking system and professional staff.",
      rating: 4,
      image: "https://randomuser.me/api/portraits/men/62.jpg"
    },
    {
      name: "Tan Wei Ling",
      position: "Environmental Compliance Officer",
      company: "EcoMalaysia",
      quote: "The detailed reporting and waste tracking features help us maintain compliance with environmental regulations. A truly forward-thinking waste management solution.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/17.jpg"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(goToNext, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Client <span className="text-gradient">Testimonials</span></h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See what our clients throughout Malaysia have to say about our waste management services.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md text-simatex-purple hover:text-simatex-purple-dark focus:outline-none md:-left-12"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md text-simatex-purple hover:text-simatex-purple-dark focus:outline-none md:-right-12"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>

          {/* Testimonial carousel */}
          <div 
            ref={containerRef} 
            className="overflow-hidden rounded-3xl shadow-xl border border-gray-100"
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="min-w-full bg-gradient-to-br from-white to-gray-50/50 p-10 md:p-16"
                >
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg">
                        {testimonial.image ? (
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <span className="text-xl font-semibold text-blue-600">
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={18} 
                            className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                          />
                        ))}
                      </div>
                      
                      <blockquote className="text-xl italic text-gray-700 mb-8 leading-relaxed">
                        "{testimonial.quote}"
                      </blockquote>
                      
                      <div>
                        <p className="font-semibold text-lg text-gray-900">{testimonial.name}</p>
                        <p className="text-gray-600">
                          {testimonial.position}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsAnimating(false), 500);
                  }
                }}
                className={`w-3 h-3 mx-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-simatex-purple w-8" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
