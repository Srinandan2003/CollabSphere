import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LogIn, User, Lock, ArrowRight, ArrowLeft } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        navigate("/home");
      } else {
        alert("Login failed: " + (data.message || "Please check your credentials"));
      }
    } catch (error) {
      alert("Connection error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      {/* Abstract background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-500 blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500 blur-3xl opacity-20"></div>
      </div>
      
      <div className="w-full max-w-md z-10">
        {/* Logo and back button */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")} 
            className="text-slate-400 hover:text-white p-0 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Button>
          
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 mr-2"></div>
            <h2 className="text-xl font-bold text-white">CollabSphere</h2>
          </div>
        </div>
        
        <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-sm shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">Welcome Back</CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Log in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="name@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-400 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <a href="#" className="text-sm text-blue-400 hover:text-blue-300">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="password"
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-400 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-medium py-5 shadow-lg shadow-blue-500/20 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-slate-700"></div>
              <span className="mx-4 text-sm text-slate-400">OR</span>
              <div className="flex-grow border-t border-slate-700"></div>
            </div>
            <Button 
              onClick={() => navigate("/register")} 
              className="w-full bg-slate-700 hover:bg-slate-600 text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <User className="h-4 w-4" />
              <span>Create an Account</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
        
        <p className="text-center text-slate-400 text-sm mt-6">
          By continuing, you agree to CollabSphere's <a href="#" className="text-blue-400 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}