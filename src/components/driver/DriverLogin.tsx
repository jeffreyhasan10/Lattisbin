import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, User } from "lucide-react";
import { toast } from "sonner";
import { useOrders } from "@/contexts/OrderContext";

const DriverLogin = () => {
  const navigate = useNavigate();
  const { getDriverByCredentials } = useOrders();
  const [credentials, setCredentials] = useState({
    driverId: "",
    lorryNumber: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      const driver = getDriverByCredentials(
        credentials.driverId,
        credentials.lorryNumber
      );
      
      if (driver) {
        toast.success(`Login successful! Welcome ${driver.name}`);
        localStorage.setItem("driverSession", JSON.stringify({
          name: driver.name,
          driverIdPermanent: driver.driverIdPermanent,
          lorryNumber: credentials.lorryNumber,
          phone: driver.phone,
          driverId: driver.id
        }));
        navigate("/driver/dashboard");
      } else {
        toast.error("Invalid credentials. Please check your details or contact admin.");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center bg-white border-b">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <Truck className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Driver Login</CardTitle>
          <p className="text-gray-600 text-sm">Lattis Bin Management System</p>
        </CardHeader>
        
        <CardContent className="p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="driverId" className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                Driver ID
              </Label>
              <Input
                id="driverId"
                type="text"
                placeholder="e.g. DRV001"
                value={credentials.driverId}
                onChange={(e) => setCredentials(prev => ({...prev, driverId: e.target.value}))}
                className="h-11"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lorryNumber" className="flex items-center gap-2 text-sm font-medium">
                <Truck className="h-4 w-4" />
                Lorry Number
              </Label>
              <Input
                id="lorryNumber"
                type="text"
                placeholder="e.g. LORRY-1001"
                value={credentials.lorryNumber}
                onChange={(e) => setCredentials(prev => ({...prev, lorryNumber: e.target.value}))}
                className="h-11"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2 text-sm font-medium">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="012-3456789"
                value={credentials.phoneNumber}
                onChange={(e) => setCredentials(prev => ({...prev, phoneNumber: e.target.value}))}
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
          
          <div className="mt-6 p-4 bg-green-50 rounded-md border border-green-200">
            <p className="text-sm text-green-800 font-medium">Demo Credentials:</p>
            <div className="text-xs text-green-600 mt-1 space-y-1">
              <p>Driver ID: DRV001  —  Lorry: LORRY-1001 or LORRY-1002</p>
              <p>Driver ID: DRV002  —  Lorry: LORRY-2001</p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={() => navigate("/")}
              className="text-green-600 hover:text-green-700"
            >
              Back to Main Site
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverLogin;
