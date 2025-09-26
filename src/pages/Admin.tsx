import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QuestCard } from "@/components/QuestCard";
import { useAuthStore } from "@/store/authStore";
import { useQuestStore } from "@/store/questStore";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Users, 
  CheckCircle, 
  XCircle, 
  Award, 
  BarChart3,
  TrendingUp,
  Activity,
  Search,
  Calendar,
  MapPin,
  Settings
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { useToast } from "@/hooks/use-toast";

// Mock analytics data
const platformStats = {
  totalFarmers: 245,
  activeQuests: 87,
  pendingApprovals: 12,
  completedQuests: 156,
  totalPoints: 125430,
  averageScore: 68,
};

const monthlyGrowth = [
  { month: 'Jan', farmers: 180, quests: 45, score: 62 },
  { month: 'Feb', farmers: 195, quests: 58, score: 64 },
  { month: 'Mar', farmers: 210, quests: 72, score: 66 },
  { month: 'Apr', farmers: 225, quests: 89, score: 67 },
  { month: 'May', farmers: 235, quests: 104, score: 68 },
  { month: 'Jun', farmers: 245, quests: 87, score: 68 },
];

const panchayatStats = [
  { name: 'Kumbakonam', farmers: 45, avgScore: 72, totalQuests: 156 },
  { name: 'Thiruvalla', farmers: 38, avgScore: 69, totalQuests: 134 },
  { name: 'Alappuzha', farmers: 52, avgScore: 66, totalQuests: 142 },
  { name: 'Palakkad', farmers: 41, avgScore: 64, totalQuests: 118 },
  { name: 'Kottayam', farmers: 36, avgScore: 61, totalQuests: 98 },
];

export default function Admin() {
  const { user } = useAuthStore();
  const { quests, approveQuest, communityPosts } = useQuestStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const pendingQuests = quests.filter(q => q.status === 'pending_approval');
  const recentPosts = communityPosts.slice(0, 5);

  const handleApproveQuest = (questId: string) => {
    approveQuest(questId);
    toast({
      title: "Quest Approved! 🎉",
      description: "Farmer has been awarded points and badges.",
    });
  };

  const handleRejectQuest = (questId: string) => {
    // In a real app, this would update the quest status to rejected
    toast({
      title: "Quest Rejected",
      description: "Farmer has been notified to provide more evidence.",
      variant: "destructive",
    });
  };

  const filteredPosts = recentPosts.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.farmerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">
          Admin Dashboard 🛡️
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage the Kerala FarmQuest platform and support farmers
        </p>
      </motion.div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="farming-card text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{platformStats.totalFarmers}</span>
              </div>
              <div className="text-sm text-muted-foreground">Total Farmers</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="farming-card text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-warning" />
                <span className="text-2xl font-bold">{platformStats.activeQuests}</span>
              </div>
              <div className="text-sm text-muted-foreground">Active Quests</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="farming-card text-center border-warning bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-warning" />
                <span className="text-2xl font-bold text-warning">{platformStats.pendingApprovals}</span>
              </div>
              <div className="text-sm text-muted-foreground">Pending Approvals</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="farming-card text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-2xl font-bold">{platformStats.completedQuests}</span>
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="farming-card text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="h-5 w-5 text-info" />
                <span className="text-2xl font-bold">{platformStats.totalPoints.toLocaleString()}</span>
              </div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="farming-card text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <span className="text-2xl font-bold">{platformStats.averageScore}%</span>
              </div>
              <div className="text-sm text-muted-foreground">Avg Score</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Admin Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Tabs defaultValue="approvals" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="approvals" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Approvals ({pendingQuests.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Community
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Quest Approvals */}
          <TabsContent value="approvals" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Pending Quest Approvals</h2>
                <Badge variant="secondary" className="bg-warning/20 text-warning">
                  {pendingQuests.length} Pending
                </Badge>
              </div>

              {pendingQuests.length === 0 ? (
                <Card className="farming-card">
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">All Caught Up! 🎉</h3>
                    <p className="text-muted-foreground">
                      No pending quest approvals at the moment.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {pendingQuests.map((quest, index) => (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="farming-card border-warning bg-warning/5">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{quest.title}</CardTitle>
                            <Badge variant="secondary" className="bg-warning/20 text-warning">
                              Pending Review
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar className="h-3 w-3" />
                                Submitted: {quest.completedAt?.toLocaleDateString() || 'Recently'}
                              </div>
                              <div className="flex items-center gap-2">
                                <Award className="h-3 w-3" />
                                Points: {quest.points}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Completed Steps:</div>
                              {quest.steps.map((step) => (
                                <div key={step.id} className="flex items-center gap-2 text-sm">
                                  {step.completed ? (
                                    <CheckCircle className="h-4 w-4 text-success" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <span className={step.completed ? 'text-success' : 'text-muted-foreground'}>
                                    {step.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex gap-2 pt-4">
                              <Button
                                onClick={() => handleApproveQuest(quest.id)}
                                className="flex-1 bg-gradient-success text-white"
                                size="sm"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleRejectQuest(quest.id)}
                                variant="outline"
                                size="sm"
                                className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Platform Analytics</h2>
              
              {/* Growth Chart */}
              <Card className="farming-card">
                <CardHeader>
                  <CardTitle>Monthly Growth Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyGrowth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="farmers" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          name="Farmers"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="quests" 
                          stroke="hsl(var(--success))" 
                          strokeWidth={2}
                          name="Active Quests"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="hsl(var(--warning))" 
                          strokeWidth={2}
                          name="Avg Score"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Panchayat Performance */}
              <Card className="farming-card">
                <CardHeader>
                  <CardTitle>Panchayat Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={panchayatStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar 
                          dataKey="avgScore" 
                          fill="hsl(var(--success))" 
                          name="Avg Score"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Community Management */}
          <TabsContent value="community" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Community Management</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="farming-card">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="" alt={post.farmerName} />
                            <AvatarFallback className="bg-gradient-primary text-white">
                              {post.farmerName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{post.farmerName}</h3>
                              <Badge variant="outline" className="text-xs">
                                {post.likes} likes
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{post.content}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{post.createdAt.toLocaleDateString()}</span>
                              {post.questTitle && (
                                <Badge variant="secondary" className="text-xs">
                                  Quest: {post.questTitle}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <CheckCircle className="h-4 w-4 text-success" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Platform Settings</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="farming-card">
                  <CardHeader>
                    <CardTitle>Quest Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" variant="outline">
                      Create New Quest
                    </Button>
                    <Button className="w-full" variant="outline">
                      Manage Quest Categories
                    </Button>
                    <Button className="w-full" variant="outline">
                      Update Point Values
                    </Button>
                  </CardContent>
                </Card>

                <Card className="farming-card">
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" variant="outline">
                      View All Users
                    </Button>
                    <Button className="w-full" variant="outline">
                      Manage Permissions
                    </Button>
                    <Button className="w-full" variant="outline">
                      Export User Data
                    </Button>
                  </CardContent>
                </Card>

                <Card className="farming-card">
                  <CardHeader>
                    <CardTitle>Rewards & Badges</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" variant="outline">
                      Create New Badge
                    </Button>
                    <Button className="w-full" variant="outline">
                      Manage Reward Tiers
                    </Button>
                    <Button className="w-full" variant="outline">
                      View Badge Statistics
                    </Button>
                  </CardContent>
                </Card>

                <Card className="farming-card">
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" variant="outline">
                      Platform Configuration
                    </Button>
                    <Button className="w-full" variant="outline">
                      Notification Settings
                    </Button>
                    <Button className="w-full" variant="outline">
                      System Maintenance
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}