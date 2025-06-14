
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Truck, User, Phone, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface UnifiedLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const UnifiedLogin = ({ isOpen, onClose }: UnifiedLoginProps) => {
  const navigate = useNavigate();
  const [adminCredentials, setAdminCredentials] = useState({
    email: "",
    password: ""
  });
  const [driverCredentials, setDriverCredentials] = useState({
    driverName: "",
    icNumber: "",
    phoneNumber: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (adminCredentials.email === "admin@lattis.com" && adminCredentials.password === "1234") {
        toast.success("Admin login successful!");
        onClose();
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        toast.error("Invalid admin credentials. Try admin@lattis.com / 1234");
      }
    }, 1000);
  };

  const handleDriverLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (driverCredentials.driverName === "Ahmad Rahman" && 
          driverCredentials.icNumber === "920815-14-5678" && 
          driverCredentials.phoneNumber === "012-3456789") {
        toast.success("Driver login successful!");
        localStorage.setItem("driverSession", JSON.stringify({
          name: "Ahmad Rahman",
          ic: "920815-14-5678",
          phone: "012-3456789",
          driverId: "DRV001"
        }));
        onClose();
        navigate("/driver/dashboard");
      } else if (driverCredentials.driverName === "Lim Wei Ming" && 
                 driverCredentials.icNumber === "880422-05-1234" && 
                 driverCredentials.phoneNumber === "017-8901234") {
        toast.success("Driver login successful!");
        localStorage.setItem("driverSession", JSON.stringify({
          name: "Lim Wei Ming",
          ic: "880422-05-1234",
          phone: "017-8901234",
          driverId: "DRV002"
        }));
        onClose();
        navigate("/driver/dashboard");
      } else {
        toast.error("Invalid driver credentials. Try Ahmad Rahman / 920815-14-5678 / 012-3456789");
      }
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-900">
            Login to Lattis Bin
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </TabsTrigger>
            <TabsTrigger value="driver" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Driver
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="admin" className="space-y-4">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@lattis.com"
                      value={adminCredentials.email}
                      onChange={(e) => setAdminCredentials(prev => ({...prev, email: e.target.value}))}
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="••••••••"
                      value={adminCredentials.password}
                      onChange={(e) => setAdminCredentials(prev => ({...prev, password: e.target.value}))}
                      className="h-11"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium">Demo Credentials:</p>
                  <p className="text-xs text-blue-600 mt-1">admin@lattis.com / 1234</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="driver" className="space-y-4">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <form onSubmit={handleDriverLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="driver-name" className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="driver-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={driverCredentials.driverName}
                      onChange={(e) => setDriverCredentials(prev => ({...prev, driverName: e.target.value}))}
                      className="h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="driver-ic" className="text-sm font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      IC Number
                    </Label>
                    <Input
                      id="driver-ic"
                      type="text"
                      placeholder="YYMMDD-PB-XXXX"
                      value={driverCredentials.icNumber}
                      onChange={(e) => setDriverCredentials(prev => ({...prev, icNumber: e.target.value}))}
                      className="h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="driver-phone" className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="driver-phone"
                      type="tel"
                      placeholder="012-3456789"
                      value={driverCredentials.phoneNumber}
                      onChange={(e) => setDriverCredentials(prev => ({...prev, phoneNumber: e.target.value}))}
                      className="h-11"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
                
                <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
                  <p className="text-sm text-green-800 font-medium">Demo Credentials:</p>
                  <div className="text-xs text-green-600 space-y-1 mt-1">
                    <p>Ahmad Rahman / 920815-14-5678 / 012-3456789</p>
                    <p>Lim Wei Ming / 880422-05-1234 / 017-8901234</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedLogin;
