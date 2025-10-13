import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Truck, MapPin, Clock, Package, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useOrders } from "@/contexts/OrderContext";

const DriverLogin = () => {
  const navigate = useNavigate();
  const { getDriverByCredentials } = useOrders();
  const [credentials, setCredentials] = useState({
    driverId: "",
    lorryNumber: ""
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      const driver = getDriverByCredentials(credentials.driverId, credentials.lorryNumber);
      if (driver) {
        toast.success("Login successful!");
        localStorage.setItem("driverSession", JSON.stringify({
          name: driver.name,
          driverIdPermanent: driver.driverIdPermanent,
          lorryNumber: credentials.lorryNumber,
          phone: driver.phone,
          driverId: driver.id
        }));
        localStorage.setItem("userType", "driver");
        navigate("/driver/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Lattis Bin</h1>
              <p className="text-sm text-gray-500">Driver Portal</p>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Hello, Welcome Back</h2>
            <p className="text-gray-600">Hey, welcome back to your driver dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="driver-id" className="text-sm font-medium text-gray-700">
                Driver ID
              </Label>
              <Input
                id="driver-id"
                type="text"
                placeholder="DRV001"
                value={credentials.driverId}
                onChange={(e) => setCredentials(prev => ({...prev, driverId: e.target.value}))}
                className="h-12"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lorry-number" className="text-sm font-medium text-gray-700">
                Lorry Number
              </Label>
              <Input
                id="lorry-number"
                type="text"
                placeholder="LORRY-1001"
                value={credentials.lorryNumber}
                onChange={(e) => setCredentials(prev => ({...prev, lorryNumber: e.target.value}))}
                className="h-12"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </Label>
              </div>
              <Link to="#" className="text-sm text-emerald-600 hover:text-emerald-700">
                Forgot Password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Demo Info */}
          <div className="mt-8 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-xs font-medium text-emerald-900 mb-3">DEMO CREDENTIALS</p>
            <div className="text-sm text-emerald-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono bg-emerald-100 px-2 py-0.5 rounded">DRV001</span>
                <span className="text-emerald-400">+</span>
                <span className="font-mono bg-emerald-100 px-2 py-0.5 rounded">LORRY-1001</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono bg-emerald-100 px-2 py-0.5 rounded">DRV001</span>
                <span className="text-emerald-400">+</span>
                <span className="font-mono bg-emerald-100 px-2 py-0.5 rounded">LORRY-1002</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono bg-emerald-100 px-2 py-0.5 rounded">DRV002</span>
                <span className="text-emerald-400">+</span>
                <span className="font-mono bg-emerald-100 px-2 py-0.5 rounded">LORRY-2001</span>
              </div>
            </div>
          </div>

          {/* Admin Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Admin?{" "}
              <Link 
                to="/admin/login" 
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Driver Features */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 relative overflow-hidden">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 w-full h-full text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-8">
            <Truck className="h-10 w-10 text-emerald-300" />
          </div>

          {/* Title */}
          <h2 className="text-4xl font-bold text-white mb-4">Driver Portal</h2>
          <p className="text-emerald-200 text-lg mb-12 max-w-md">Manage your waste bin deliveries and collections efficiently</p>

          {/* Features List */}
          <div className="space-y-6 max-w-md">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-emerald-300" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">View Delivery Orders</p>
                <p className="text-emerald-300 text-sm">Check your assigned deliveries</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-teal-300" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Manage Trips</p>
                <p className="text-emerald-300 text-sm">Track lorry movements</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-300" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Upload Photos</p>
                <p className="text-emerald-300 text-sm">Document your deliveries</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-300" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Collect Payments</p>
                <p className="text-emerald-300 text-sm">Cash & receipt management</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverLogin;

