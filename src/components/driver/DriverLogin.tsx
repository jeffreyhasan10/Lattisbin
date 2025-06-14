import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, User, Phone, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DriverLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    driverName: "",
    icNumber: "",
    phoneNumber: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication with dummy data
    setTimeout(() => {
      setIsLoading(false);
      
      // Check dummy driver credentials
      if (credentials.driverName === "Ahmad Rahman" && 
          credentials.icNumber === "920815-14-5678" && 
          credentials.phoneNumber === "012-3456789") {
        toast.success("Login successful! Welcome Ahmad Rahman");
        // Store driver session
        localStorage.setItem("driverSession", JSON.stringify({
          name: "Ahmad Rahman",
          ic: "920815-14-5678",
          phone: "012-3456789",
          driverId: "DRV001"
        }));
        navigate("/driver/dashboard");
      } else if (credentials.driverName === "Lim Wei Ming" && 
                 credentials.icNumber === "880422-05-1234" && 
                 credentials.phoneNumber === "017-8901234") {
        toast.success("Login successful! Welcome Lim Wei Ming");
        localStorage.setItem("driverSession", JSON.stringify({
          name: "Lim Wei Ming",
          ic: "880422-05-1234",
          phone: "017-8901234",
          driverId: "DRV002"
        }));
        navigate("/driver/dashboard");
      } else {
        toast.error("Invalid credentials. Try Ahmad Rahman / 920815-14-5678 / 012-3456789");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
          <div className="flex justify-center mb-4">
            <Truck className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold">Driver Portal</CardTitle>
          <p className="text-green-100">Lattis Bin Management System</p>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="driverName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Driver Name
              </Label>
              <Input
                id="driverName"
                type="text"
                placeholder="Enter your full name"
                value={credentials.driverName}
                onChange={(e) => setCredentials(prev => ({...prev, driverName: e.target.value}))}
                className="h-12 text-lg"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="icNumber" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                IC Number
              </Label>
              <Input
                id="icNumber"
                type="text"
                placeholder="YYMMDD-PB-XXXX"
                value={credentials.icNumber}
                onChange={(e) => setCredentials(prev => ({...prev, icNumber: e.target.value}))}
                className="h-12 text-lg"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="012-3456789"
                value={credentials.phoneNumber}
                onChange={(e) => setCredentials(prev => ({...prev, phoneNumber: e.target.value}))}
                className="h-12 text-lg"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">Demo Credentials:</p>
            <div className="text-xs text-blue-600 mt-1">
              <p>Ahmad Rahman / 920815-14-5678 / 012-3456789</p>
              <p>Lim Wei Ming / 880422-05-1234 / 017-8901234</p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={() => navigate("/")}
              className="text-green-600"
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
