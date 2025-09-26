import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { QuestCard } from "@/components/QuestCard";
import { BadgeCard } from "@/components/BadgeCard";
import { useAuthStore } from "@/store/authStore";
import { useQuestStore } from "@/store/questStore";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Award, 
  Target, 
  Calendar,
  Leaf,
  Trophy,
  Users,
  MapPin,
  BarChart3
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Mock data for sustainability progress chart
const sustainabilityData = [
  { month: 'Jan', score: 45 },
  { month: 'Feb', score: 52 },
  { month: 'Mar', score: 58 },
  { month: 'Apr', score: 65 },
  { month: 'May', score: 72 },
  { month: 'Jun', score: 78 },
];

// Mock data for quest category distribution
const questCategoryData = [
  { name: 'Soil Health', value: 35, color: '#22c55e' },
  { name: 'Water Conservation', value: 25, color: '#3b82f6' },
  { name: 'Biodiversity', value: 20, color: '#8b5cf6' },
  { name: 'Organic Practices', value: 20, color: '#f59e0b' },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const { getActiveQuests, getAvailableQuests, startQuest } = useQuestStore();
  const navigate = useNavigate();
  const [celebrateScore, setCelebrateScore] = useState(false);

  const activeQuests = user ? getActiveQuests(user.id) : [];
  const availableQuests = user ? getAvailableQuests(user.id).slice(0, 3) : [];

  // Trigger celebration animation for high sustainability scores
  useEffect(() => {
    if (user && user.sustainabilityScore >= 75) {
      setTimeout(() => setCelebrateScore(true), 1000);
    }
  }, [user]);

  const handleStartQuest = (questId: string) => {
    if (user) {
      startQuest(questId, user.id);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreVariant = (score: number): 'default' | 'success' | 'warning' | 'info' => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'info';
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">
          Welcome back, {user.name}! 🌱
        </h1>
        <div className="flex items-center justify-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {user.panchayat}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="farming-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Sustainability Score
                  </p>
                  <p className={`text-3xl font-bold ${getScoreColor(user.sustainabilityScore)} ${
                    celebrateScore ? 'animate-reward-celebration' : ''
                  }`}>
                    {user.sustainabilityScore}%
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-success rounded-full flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="farming-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Current Level
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {user.level}
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-earth rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="farming-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Points
                  </p>
                  <p className="text-3xl font-bold text-warning">
                    {user.totalPoints.toLocaleString()}
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-sky rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="farming-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Quests
                  </p>
                  <p className="text-3xl font-bold text-info">
                    {activeQuests.length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sustainability Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="farming-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sustainability Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <ProgressBar 
                  value={user.sustainabilityScore} 
                  variant={getScoreVariant(user.sustainabilityScore)}
                  label="Overall Sustainability Score"
                />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sustainabilityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quest Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="farming-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Quest Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={questCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {questCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {questCategoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <span className="font-medium">{category.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Active Quests */}
      {activeQuests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Active Quests
            </h2>
            <Button 
              variant="outline" 
              onClick={() => navigate('/quests')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              View All
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onContinue={() => navigate(`/quests/${quest.id}`)}
                showProgress={true}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Available Quests */}
      {availableQuests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              Recommended Quests
            </h2>
            <Button 
              variant="outline" 
              onClick={() => navigate('/quests')}
            >
              Explore More
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onStart={() => handleStartQuest(quest.id)}
                showProgress={false}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Badges */}
      {user.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-badge-gold" />
              Recent Achievements
            </h2>
            <Badge variant="secondary" className="bg-badge-gold/20 text-badge-gold">
              {user.badges.length} Earned
            </Badge>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {user.badges.slice(0, 4).map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                size="sm"
                animate={true}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}