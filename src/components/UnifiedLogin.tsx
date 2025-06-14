
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Truck, User, Phone, CreditCard, Facebook } from "lucide-react";
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
        toast.success("Admin login successful! Redirecting to dashboard...");
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
        toast.success("Driver login successful! Welcome Ahmad Rahman");
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
        toast.success("Driver login successful! Welcome Lim Wei Ming");
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

  const handleSocialLogin = (provider: string) => {
    toast.info(`Logging in with ${provider}...`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-display">
            Welcome to Lattis Bin
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin Login
            </TabsTrigger>
            <TabsTrigger value="driver" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Driver Login
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="admin" className="space-y-4">
            <Card>
              <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <div className="flex justify-center mb-2">
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="text-lg">Admin Portal</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@lattis.com"
                      value={adminCredentials.email}
                      onChange={(e) => setAdminCredentials(prev => ({...prev, email: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="••••••••"
                      value={adminCredentials.password}
                      onChange={(e) => setAdminCredentials(prev => ({...prev, password: e.target.value}))}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login as Admin"}
                  </Button>
                </form>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">Demo Credentials:</p>
                  <p className="text-xs text-blue-600">admin@lattis.com / 1234</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="driver" className="space-y-4">
            <Card>
              <CardHeader className="text-center bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <div className="flex justify-center mb-2">
                  <Truck className="h-8 w-8" />
                </div>
                <CardTitle className="text-lg">Driver Portal</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleDriverLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="driver-name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Driver Name
                    </Label>
                    <Input
                      id="driver-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={driverCredentials.driverName}
                      onChange={(e) => setDriverCredentials(prev => ({...prev, driverName: e.target.value}))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="driver-ic" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      IC Number
                    </Label>
                    <Input
                      id="driver-ic"
                      type="text"
                      placeholder="YYMMDD-PB-XXXX"
                      value={driverCredentials.icNumber}
                      onChange={(e) => setDriverCredentials(prev => ({...prev, icNumber: e.target.value}))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="driver-phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="driver-phone"
                      type="tel"
                      placeholder="012-3456789"
                      value={driverCredentials.phoneNumber}
                      onChange={(e) => setDriverCredentials(prev => ({...prev, phoneNumber: e.target.value}))}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login as Driver"}
                  </Button>
                </form>
                
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">Demo Credentials:</p>
                  <div className="text-xs text-green-600 space-y-1">
                    <p>Ahmad Rahman / 920815-14-5678 / 012-3456789</p>
                    <p>Lim Wei Ming / 880422-05-1234 / 017-8901234</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => handleSocialLogin("Google")}
            className="border-gray-200"
          >
            <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </Button>
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => handleSocialLogin("Facebook")}
            className="border-gray-200"
          >
            <Facebook className="mr-2 h-4 w-4" />
            Facebook
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedLogin;
