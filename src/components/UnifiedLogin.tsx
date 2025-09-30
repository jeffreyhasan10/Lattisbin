
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Truck, User } from "lucide-react";
import { toast } from "sonner";
import { useOrders } from "@/contexts/OrderContext";

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
  const { getDriverByCredentials } = useOrders();
  const [driverCredentials, setDriverCredentials] = useState({
    driverId: "",
    lorryNumber: ""
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
      
      const driver = getDriverByCredentials(driverCredentials.driverId, driverCredentials.lorryNumber);
      if (driver) {
        toast.success("Driver login successful!");
        localStorage.setItem("driverSession", JSON.stringify({
          name: driver.name,
          driverIdPermanent: driver.driverIdPermanent,
          lorryNumber: driverCredentials.lorryNumber,
          phone: driver.phone,
          driverId: driver.id
        }));
        onClose();
        navigate("/driver/dashboard");
      } else {
        toast.error("Invalid driver credentials. Use Driver ID + Lorry Number from demo.");
      }
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[92vw] max-w-md sm:max-w-md p-4 sm:p-6 gap-4 sm:gap-6" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-900">
            Login to Lattis Bin
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
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
                <form onSubmit={handleAdminLogin} className="space-y-3 sm:space-y-4">
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
                <form onSubmit={handleDriverLogin} className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="driver-id" className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Driver ID
                    </Label>
                    <Input
                      id="driver-id"
                      type="text"
                      placeholder="e.g. DRV001"
                      value={driverCredentials.driverId}
                      onChange={(e) => setDriverCredentials(prev => ({...prev, driverId: e.target.value}))}
                      className="h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lorry-number" className="text-sm font-medium flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Lorry Number
                    </Label>
                    <Input
                      id="lorry-number"
                      type="text"
                      placeholder="e.g. LORRY-1001"
                      value={driverCredentials.lorryNumber}
                      onChange={(e) => setDriverCredentials(prev => ({...prev, lorryNumber: e.target.value}))}
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
                    <p>Driver ID: DRV001  —  Lorry: LORRY-1001 or LORRY-1002</p>
                    <p>Driver ID: DRV002  —  Lorry: LORRY-2001</p>
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
