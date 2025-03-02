import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Globe, Zap, LogIn } from "lucide-react";

export function LandingPage({ user }) {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
      {/* Abstract background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/5"></div>
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-500 blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500 blur-3xl opacity-20"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center w-full mb-16">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 mr-2"></div>
            <h2 className="text-2xl font-bold text-white">CollabSphere</h2>
          </div>
          {!user && (
            <div className="flex gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")}
                className="text-white hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300 rounded-md font-medium px-4 py-2 flex items-center gap-2 border border-transparent hover:border-blue-500/30"
              >
                <LogIn className="h-4 w-4" /> Login
              </Button>
            </div>
          )}
        </div>

        {/* Hero section */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full py-16 gap-8">
          <div className="text-left max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">collaboration</span> meets innovation
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Connect with thought leaders, share ideas, and build your professional network in a space designed for modern collaboration.
            </p>
            <div className="flex gap-4">
              {!user ? (
                <>
                  <Button 
                    onClick={() => navigate("/register")} 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white px-8 py-6 shadow-lg shadow-blue-500/20 rounded-md font-medium transition-all duration-300 transform hover:scale-105"
                    size="lg"
                  >
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/login")}
                    className="bg-white/5 text-white border-slate-600 hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-300 rounded-md font-medium px-8 py-6 shadow-md backdrop-blur-sm flex items-center gap-2"
                    size="lg"
                  >
                    <LogIn className="h-4 w-4" /> Sign In
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => navigate("/home")} 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white px-8 py-6 shadow-lg shadow-blue-500/20 rounded-md font-medium transition-all duration-300 transform hover:scale-105"
                  size="lg"
                >
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Hero image/graphic */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative h-64 w-64 md:h-80 md:w-80 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl overflow-hidden border border-slate-700">
              <div className="absolute inset-0 bg-grid-white/5"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-80 blur-sm"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full my-16">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="rounded-full bg-blue-500/10 w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Community Driven</h3>
              <p className="text-slate-300">Join a thriving ecosystem of professionals, creators, and innovators.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="rounded-full bg-purple-500/10 w-12 h-12 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Global Reach</h3>
              <p className="text-slate-300">Connect with collaborators and audiences from around the world.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="rounded-full bg-emerald-500/10 w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Powerful Tools</h3>
              <p className="text-slate-300">Access cutting-edge collaboration features and analytics.</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA section */}
        <div className="w-full max-w-3xl mx-auto my-16">
          <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to transform your collaboration experience?</h2>
                <p className="text-slate-300 mb-6">Join thousands of professionals already using CollabSphere.</p>
                {!user ? (
                  <Button 
                    onClick={() => navigate("/register")} 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white px-8 shadow-lg shadow-blue-500/20 rounded-md font-medium transition-all duration-300 transform hover:scale-105"
                    size="lg"
                  >
                    Start For Free
                  </Button>
                ) : (
                  <Button 
                    onClick={() => navigate("/home")} 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white px-8 shadow-lg shadow-blue-500/20 rounded-md font-medium transition-all duration-300 transform hover:scale-105"
                    size="lg"
                  >
                    Go to Dashboard
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="w-full mt-auto pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">© 2025 CollabSphere. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white text-sm">About</a>
              <a href="#" className="text-slate-400 hover:text-white text-sm">Features</a>
              <a href="#" className="text-slate-400 hover:text-white text-sm">Pricing</a>
              <a href="#" className="text-slate-400 hover:text-white text-sm">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}