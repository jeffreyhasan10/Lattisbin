
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Send, MessageSquare } from "lucide-react";

const ContactSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully! We'll be in touch soon.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setIsLoading(false);
    }, 1500);
  };

  // Format phone number to Malaysian format
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (!digits.length) return '';
    if (digits.startsWith('60')) {
      if (digits.length <= 2) return `+${digits}`;
      return `+${digits.slice(0, 2)} ${digits.slice(2)}`;
    }
    if (digits.length === 1) return `+60 ${digits}`;
    return `+60 ${digits}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value);
    setPhone(formattedPhone);
  };

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get in <span className="text-gradient">Touch</span></h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Have questions about our services or the Bin Management System? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left column - Contact Form */}
          <div className="bg-white rounded-2xl shadow-md p-8 opacity-0 animate-fade-in">
            <h3 className="text-2xl font-semibold mb-6">Send us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+60 123456789"
                  value={phone}
                  onChange={handlePhoneChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="How can we help you?"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-simatex-purple hover:bg-simatex-purple-dark"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Message"}
                <Send size={16} className="ml-2" />
              </Button>
            </form>
          </div>
          
          {/* Right column - Contact Info & Map */}
          <div className="opacity-0 animate-fade-in animate-delay-200">
            <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="bg-simatex-purple/10 p-3 rounded-full mr-4">
                    <Phone className="text-simatex-purple" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Phone</p>
                    <p>+60 3-2345 6789</p>
                    <p className="text-sm text-gray-500">Mon-Fri, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-simatex-purple/10 p-3 rounded-full mr-4">
                    <Mail className="text-simatex-purple" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Email</p>
                    <p>info@lattisbin.com.my</p>
                    <p className="text-sm text-gray-500">We reply within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-simatex-purple/10 p-3 rounded-full mr-4">
                    <MapPin className="text-simatex-purple" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Office</p>
                    <p>123 Jalan Ampang, 50450 Kuala Lumpur, Malaysia</p>
                    <p className="text-sm text-gray-500">Our headquarters</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-simatex-purple/10 p-3 rounded-full mr-4">
                    <MessageSquare className="text-simatex-purple" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">WhatsApp</p>
                    <p>+60 12-345 6789</p>
                    <p className="text-sm text-gray-500">Quick response for urgent inquiries</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl overflow-hidden h-64 shadow-md">
              {/* Google Maps iframe - Replace with your actual location */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.7588367302054!2d101.7125631147513!3d3.1518936541363086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc37d0606db20d%3A0x75f1a5250f75b1e1!2sJalan%20Ampang%2C%20Kuala%20Lumpur%2C%20Federal%20Territory%20of%20Kuala%20Lumpur!5e0!3m2!1sen!2smy!4v1619049520346!5m2!1sen!2smy"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen={false}
                aria-hidden="false"
                tabIndex={0}
                title="Lattis Office Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
