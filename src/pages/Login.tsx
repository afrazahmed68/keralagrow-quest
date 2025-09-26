import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Leaf, Users, Shield, Sprout } from "lucide-react";

const demoAccounts = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    role: 'Administrator',
    icon: Shield,
    description: 'Manage quests, approve completions, and oversee the platform',
    color: 'bg-destructive text-destructive-foreground',
  },
  {
    username: 'farmer1',
    password: 'demo123',
    name: 'Ravi Kumar (Level 5)',
    role: 'Experienced Farmer',
    icon: Sprout,
    description: 'Has completed multiple quests and earned several badges',
    color: 'bg-badge-gold text-white',
  },
  {
    username: 'farmer2',
    password: 'demo123',
    name: 'Priya Nair (Level 6)',
    role: 'Organic Champion',
    icon: Leaf,
    description: 'Specialist in organic farming with high sustainability score',
    color: 'bg-success text-success-foreground',
  },
  {
    username: 'farmer3',
    password: 'demo123',
    name: 'Suresh Menon (Level 3)',
    role: 'New Farmer',
    icon: Users,
    description: 'Just started the sustainable farming journey',
    color: 'bg-info text-info-foreground',
  },
];

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const user = await login(username, password);
      if (user) {
        toast({
          title: "Welcome back!",
          description: `Logged in as ${user.name}`,
        });
        navigate('/');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
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

  const handleDemoLogin = async (demoUsername: string, demoPassword: string) => {
    setIsLoading(true);
    const user = await login(demoUsername, demoPassword);
    if (user) {
      toast({
        title: "Demo Login Successful!",
        description: `Welcome, ${user.name}!`,
      });
      navigate('/');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur">
              <Leaf className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Kerala FarmQuest
              </h1>
              <p className="text-xl text-white/80">
                Gamified Platform for Sustainable Farming
              </p>
            </div>
          </div>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Join Kerala's agricultural transformation through engaging quests, 
            sustainable practices, and community-driven learning.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Demo Accounts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Demo Accounts</CardTitle>
                <CardDescription className="text-center">
                  Choose a demo account to explore the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoAccounts.map((account, index) => {
                  const Icon = account.icon;
                  return (
                    <motion.div
                      key={account.username}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    >
                      <Button
                        onClick={() => handleDemoLogin(account.username, account.password)}
                        disabled={isLoading}
                        className="w-full p-6 h-auto justify-start text-left hover:scale-[1.02] transition-all"
                        variant="outline"
                      >
                        <div className="flex items-center gap-4 w-full">
                          <div className={`p-3 rounded-lg ${account.color}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{account.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {account.role}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {account.description}
                            </p>
                            <div className="text-xs text-muted-foreground mt-1">
                              Username: <code className="bg-muted px-1 rounded">{account.username}</code>
                            </div>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Manual Login */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Manual Login</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials manually
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full hero-button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Demo Credentials:</h4>
                  <div className="text-sm space-y-1">
                    <div>• Admin: <code>admin</code> / <code>admin123</code></div>
                    <div>• Farmers: <code>farmer1-3</code> / <code>demo123</code></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-white/60 text-sm">
            Kerala Department of Agriculture • Sustainable Farming Initiative 2024
          </p>
        </motion.div>
      </div>
    </div>
  );
}