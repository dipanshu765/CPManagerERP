import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Shield, Lock, User, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Loader from "../components/common/loader";

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [animatedElements, setAnimatedElements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Floating animation elements
  useEffect(() => {
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 20,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: Math.random() * 10 + 10,
    }));
    setAnimatedElements(elements);
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Static login validation
      if (data.email === "admin@cpmanager.com" && data.password === "admin123") {
        toast({
          title: "Login Successful",
          description: "Welcome to CP Manager ERP",
        });
        setLocation("/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {animatedElements.map((element) => (
          <div
            key={element.id}
            className="absolute bg-white bg-opacity-5 rounded-full animate-float"
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
              left: `${element.left}%`,
              '--delay': `${element.delay}s`,
              '--duration': `${element.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Geometric shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 border border-white border-opacity-20 rotate-45 animate-spin-slow"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 border border-white border-opacity-20 rotate-12 animate-pulse"></div>
      <div className="absolute top-1/3 right-20 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-bounce"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header with animation */}
        <div className="text-center animate-fade-in-down">
          <div className="flex justify-center mb-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-full animate-pulse">
              <Shield className="text-white h-12 w-12" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">CP Manager ERP</h1>
          <p className="text-gray-300 text-lg animate-fade-in-up">Enterprise Resource Planning</p>
        </div>
        
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white bg-opacity-95 animate-slide-up">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-black to-gray-600 p-3 rounded-full animate-bounce">
                  <User className="text-white h-8 w-8" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 animate-fade-in">Sign In</h2>
              <p className="text-gray-600 mt-2 animate-fade-in-up">Welcome back to your dashboard</p>
            </div>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="animate-slide-in-left">
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Email Address</span>
                  </div>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...form.register("email")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all transform hover:scale-105"
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1 animate-shake">{form.formState.errors.email.message}</p>
                )}
              </div>
              
              <div className="animate-slide-in-right">
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Password</span>
                  </div>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...form.register("password")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all transform hover:scale-105 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1 animate-shake">{form.formState.errors.password.message}</p>
                )}
              </div>
              
              <div className="flex items-center justify-between animate-fade-in">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    {...form.register("rememberMe")}
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Remember me</span>
                    </div>
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={() => setLocation("/forgot-password")}
                  className="text-sm text-black hover:underline transition-all transform hover:scale-105"
                >
                  Forgot password?
                </button>
              </div>
              
              <Button
                type="submit"
                className="w-full py-3 px-4 gradient-bg text-white font-semibold rounded-lg hover:opacity-90 transition-all transform hover:scale-105 focus:ring-4 focus:ring-gray-300 animate-pulse-custom"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center text-gray-300 text-sm animate-fade-in-up">
          <p className="bg-black bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
            Demo credentials: admin@cpmanager.com / admin123
          </p>
        </div>
      </div>

      {/* Loader */}
      <Loader isLoading={isLoading} text="Authenticating user" />
    </div>
  );
}