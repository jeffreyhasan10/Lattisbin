
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Menu, X, Truck, Package, FileText, MessageCircle, Globe, Twitter, Linkedin, Phone, Mail } from 'lucide-react';

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [showChatbot, setShowChatbot] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const testimonials = [
    {
      quote: "Lattis Bin reduced our delivery time by 30%!",
      author: "Jane Smith",
      position: "Waste Manager, EcoCorp"
    },
    {
      quote: "Invoicing is now a breeze with automation.",
      author: "Ahmad Zain", 
      position: "Operations Head, Green Solutions"
    },
    {
      quote: "Real-time bin tracking is a game-changer!",
      author: "Lisa Tan",
      position: "CEO, CleanCity"
    }
  ];

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'BM', name: 'Bahasa Malaysia' },
    { code: 'ZH', name: '中文' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 h-24 bg-gradient-to-r from-[#1A3C34] to-[#2E5A50] shadow-lg">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Package className="w-8 h-8 text-white" />
            </div>
            <span className="text-white text-2xl font-bold font-montserrat">Lattis Bin</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setLanguage(language === 'EN' ? 'BM' : language === 'BM' ? 'ZH' : 'EN')}
                className="flex items-center space-x-1 text-white hover:text-green-300 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{language}</span>
              </button>
            </div>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full hover:bg-green-500 hover:border-green-500 transition-all duration-300 font-medium">
              Login
            </button>
            <button className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-colors font-medium shadow-md">
              Signup
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#1A3C34] border-t border-green-500/20">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <button className="block w-full text-left text-white hover:text-green-300 transition-colors">
                Login
              </button>
              <button className="block w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition-colors">
                Signup
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3')] bg-cover bg-center opacity-30"></div>
        
        {/* Animated Elements */}
        <div className="absolute left-10 top-1/2 transform -translate-y-1/2 animate-fade-in">
          <Package className="w-16 h-16 text-green-400 animate-pulse" />
        </div>
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2 animate-fade-in animation-delay-1000">
          <Truck className="w-16 h-16 text-green-400 animate-pulse" />
        </div>

        <div className="relative text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold font-montserrat mb-6 animate-fade-in">
            Revolutionize Waste Management with Lattis Bin
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in animation-delay-500">
            Streamline bin rentals, deliveries, and invoicing with our all-in-one platform.
          </p>
          <button className="bg-green-500 hover:bg-green-600 text-white px-12 py-4 rounded-full text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl animate-fade-in animation-delay-1000">
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16 font-montserrat">
            Why Choose Lattis Bin?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-2 hover:border-green-500 group">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Bin Inventory Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Manage 500+ bins like ASR 100 (4x12x6ft) with real-time status tracking and location monitoring.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-2 hover:border-green-500 group">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Delivery Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Assign drivers like John Doe to lorries (Reg: ABC123) for 50 daily deliveries with route optimization.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-2 hover:border-green-500 group">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Smart Invoicing</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate 100+ invoices daily for clients like ABC Corp, track RM 10,000 in payments automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16 font-montserrat">
            What Our Clients Say
          </h2>
          
          <div className="max-w-4xl mx-auto relative">
            <div className="bg-gray-50 rounded-2xl p-12 text-center shadow-lg">
              <div className="text-6xl text-green-500 mb-6">"</div>
              <p className="text-2xl text-gray-700 italic mb-8 leading-relaxed">
                {testimonials[currentTestimonial].quote}
              </p>
              <div className="text-gray-600">
                <p className="font-semibold text-lg">{testimonials[currentTestimonial].author}</p>
                <p className="text-sm">{testimonials[currentTestimonial].position}</p>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-4 h-4 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-green-50 transition-colors"
              onClick={() => setCurrentTestimonial(currentTestimonial === 0 ? testimonials.length - 1 : currentTestimonial - 1)}
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-green-50 transition-colors"
              onClick={() => setCurrentTestimonial((currentTestimonial + 1) % testimonials.length)}
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A3C34] py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="text-white mb-6">
            <p className="text-lg mb-2">© 2025 Lattis Bin. All rights reserved.</p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@lattisbin.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+60 123-456-789</span>
              </div>
              <button className="hover:underline transition-all">Privacy Policy</button>
            </div>
          </div>
          
          <div className="flex justify-center space-x-6">
            <button className="w-12 h-12 bg-gray-700 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors">
              <Twitter className="w-5 h-5 text-white" />
            </button>
            <button className="w-12 h-12 bg-gray-700 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors">
              <Linkedin className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </footer>

      {/* Chatbot Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {showChatbot ? (
          <div className="bg-white rounded-2xl shadow-2xl w-80 h-96 border border-gray-200 flex flex-col">
            <div className="bg-green-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <h3 className="font-semibold">Lattis Support</h3>
              <button onClick={() => setShowChatbot(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-4">
              <div className="bg-gray-100 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">Hi! Need help with bin management?</p>
              </div>
            </div>
            <div className="p-4 border-t">
              <input 
                type="text" 
                placeholder="Type your message..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowChatbot(true)}
            className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Contact Form */}
      <div className="fixed bottom-6 right-24 z-40">
        {showContactForm ? (
          <div className="bg-white rounded-2xl shadow-2xl w-80 border border-gray-200">
            <div className="bg-green-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <h3 className="font-semibold">Contact Us</h3>
              <button onClick={() => setShowContactForm(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <input 
                type="text" 
                placeholder="Your Name"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
              />
              <input 
                type="email" 
                placeholder="Your Email"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
              />
              <textarea 
                placeholder="Your Message"
                rows={3}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
              />
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors">
                Send Message
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowContactForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 text-sm font-medium"
          >
            Contact Us
          </button>
        )}
      </div>
    </div>
  );
};

export default Index;
