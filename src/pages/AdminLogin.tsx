import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Shield, Users, BarChart3, Lock } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (credentials.email === "admin@lattis.com" && credentials.password === "1234") {
        toast.success("Login successful!");
        localStorage.setItem("userType", "admin");
        navigate("/admin/dashboard");
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
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Lattis Bin</h1>
              <p className="text-sm text-gray-500">Admin Portal</p>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Hello, Welcome Back</h2>
            <p className="text-gray-600">Hey, welcome back to your admin dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@lattis.com"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({...prev, email: e.target.value}))}
                className="h-12"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
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
              <Link to="#" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot Password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Demo Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-medium text-blue-900 mb-2">DEMO CREDENTIALS</p>
            <div className="text-sm text-blue-700">
              <p><span className="font-mono text-xs bg-blue-100 px-2 py-0.5 rounded">admin@lattis.com</span> / <span className="font-mono text-xs bg-blue-100 px-2 py-0.5 rounded">1234</span></p>
            </div>
          </div>

          {/* Driver Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Driver?{" "}
              <Link 
                to="/driver/login" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Admin Features */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 w-full h-full text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-8">
            <Building2 className="h-10 w-10 text-blue-300" />
          </div>

          {/* Title */}
          <h2 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h2>
          <p className="text-blue-200 text-lg mb-12 max-w-md">Complete control over your waste bin management operations</p>

          {/* Features List */}
          <div className="space-y-6 max-w-md">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-300" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Manage Customers & Drivers</p>
                <p className="text-blue-300 text-sm">User management system</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-indigo-300" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Track Bins & Lorries</p>
                <p className="text-blue-300 text-sm">Fleet & inventory tracking</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Lock className="h-6 w-6 text-purple-300" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Invoice & Payments</p>
                <p className="text-blue-300 text-sm">Financial management</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-300" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Reports & Analytics</p>
                <p className="text-blue-300 text-sm">Business insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

