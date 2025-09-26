import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  TrendingUp,
  MapPin,
  Star,
  Zap
} from "lucide-react";

// Mock leaderboard data
const panchayatLeaderboard = [
  {
    id: 'farmer2',
    name: 'Priya Nair',
    panchayat: 'Kumbakonam',
    sustainabilityScore: 85,
    totalPoints: 1870,
    level: 6,
    completedQuests: 12,
    badges: 8,
    rank: 1,
    change: '+2',
    avatar: '',
  },
  {
    id: 'farmer1',
    name: 'Ravi Kumar',
    panchayat: 'Thiruvalla',
    sustainabilityScore: 78,
    totalPoints: 1560,
    level: 5,
    completedQuests: 10,
    badges: 6,
    rank: 2,
    change: '-1',
    avatar: '',
  },
  {
    id: 'farmer4',
    name: 'Maya Krishnan',
    panchayat: 'Alappuzha',
    sustainabilityScore: 73,
    totalPoints: 1420,
    level: 5,
    completedQuests: 9,
    badges: 5,
    rank: 3,
    change: '+1',
    avatar: '',
  },
  {
    id: 'farmer3',
    name: 'Suresh Menon',
    panchayat: 'Palakkad',
    sustainabilityScore: 62,
    totalPoints: 920,
    level: 3,
    completedQuests: 6,
    badges: 3,
    rank: 4,
    change: '+0',
    avatar: '',
  },
  {
    id: 'farmer5',
    name: 'Anitha Thomas',
    panchayat: 'Kottayam',
    sustainabilityScore: 58,
    totalPoints: 840,
    level: 3,
    completedQuests: 5,
    badges: 2,
    rank: 5,
    change: '-2',
    avatar: '',
  },
];

const panchayatRankings = [
  {
    name: 'Kumbakonam',
    totalFarmers: 45,
    avgScore: 72,
    totalPoints: 32450,
    completedQuests: 156,
    rank: 1,
  },
  {
    name: 'Thiruvalla',
    totalFarmers: 38,
    avgScore: 69,
    totalPoints: 28940,
    completedQuests: 134,
    rank: 2,
  },
  {
    name: 'Alappuzha',
    totalFarmers: 52,
    avgScore: 66,
    totalPoints: 31280,
    completedQuests: 142,
    rank: 3,
  },
  {
    name: 'Palakkad',
    totalFarmers: 41,
    avgScore: 64,
    totalPoints: 25670,
    completedQuests: 118,
    rank: 4,
  },
  {
    name: 'Kottayam',
    totalFarmers: 36,
    avgScore: 61,
    totalPoints: 22480,
    completedQuests: 98,
    rank: 5,
  },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-badge-gold" />;
    case 2:
      return <Medal className="h-6 w-6 text-badge-silver" />;
    case 3:
      return <Award className="h-6 w-6 text-badge-bronze" />;
    default:
      return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  }
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'border-badge-gold bg-badge-gold/5';
    case 2:
      return 'border-badge-silver bg-badge-silver/5';
    case 3:
      return 'border-badge-bronze bg-badge-bronze/5';
    default:
      return 'border-muted';
  }
};

const getChangeIndicator = (change: string) => {
  const value = parseInt(change);
  if (value > 0) {
    return (
      <div className="flex items-center text-success text-xs">
        <TrendingUp className="h-3 w-3 mr-1" />
        +{value}
      </div>
    );
  } else if (value < 0) {
    return (
      <div className="flex items-center text-destructive text-xs">
        <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
        {value}
      </div>
    );
  }
  return (
    <div className="text-muted-foreground text-xs">
      -
    </div>
  );
};

export default function Leaderboard() {
  const { user } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState('farmers');

  if (!user) return null;

  const userRank = panchayatLeaderboard.find(farmer => farmer.id === user.id);

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
          Leaderboard 🏆
        </h1>
        <p className="text-muted-foreground text-lg">
          See how you rank among Kerala's sustainable farmers
        </p>
      </motion.div>

      {/* User's Current Rank */}
      {userRank && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className={`farming-card ${getRankColor(userRank.rank)} animate-pulse-glow`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary">
                  {getRankIcon(userRank.rank)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">Your Current Rank</h3>
                    {getChangeIndicator(userRank.change)}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Rank</div>
                      <div className="font-semibold">#{userRank.rank}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Score</div>
                      <div className="font-semibold">{userRank.sustainabilityScore}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Points</div>
                      <div className="font-semibold">{userRank.totalPoints.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Level</div>
                      <div className="font-semibold">{userRank.level}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Leaderboard Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="farmers" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Top Farmers
            </TabsTrigger>
            <TabsTrigger value="panchayats" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Panchayat Rankings
            </TabsTrigger>
          </TabsList>

          {/* Farmers Leaderboard */}
          <TabsContent value="farmers" className="mt-6">
            <div className="space-y-4">
              {panchayatLeaderboard.map((farmer, index) => (
                <motion.div
                  key={farmer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className={`farming-card ${getRankColor(farmer.rank)} ${
                    farmer.id === user.id ? 'ring-2 ring-primary' : ''
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                          {getRankIcon(farmer.rank)}
                        </div>

                        {/* Avatar */}
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={farmer.avatar} alt={farmer.name} />
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {farmer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold">{farmer.name}</h3>
                            {farmer.id === user.id && (
                              <Badge variant="secondary" className="text-xs">You</Badge>
                            )}
                            {getChangeIndicator(farmer.change)}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-3 w-3" />
                            {farmer.panchayat}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3 w-3 text-warning" />
                            <span className="font-semibold">{farmer.sustainabilityScore}%</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Zap className="h-3 w-3 text-info" />
                            <span>{farmer.totalPoints.toLocaleString()}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Level {farmer.level} • {farmer.badges} badges
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Panchayat Rankings */}
          <TabsContent value="panchayats" className="mt-6">
            <div className="space-y-4">
              {panchayatRankings.map((panchayat, index) => (
                <motion.div
                  key={panchayat.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className={`farming-card ${getRankColor(panchayat.rank)} ${
                    panchayat.name === user.panchayat ? 'ring-2 ring-primary' : ''
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                          {getRankIcon(panchayat.rank)}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold">{panchayat.name}</h3>
                            {panchayat.name === user.panchayat && (
                              <Badge variant="secondary" className="text-xs">Your Panchayat</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {panchayat.totalFarmers} farmers participating
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 text-center text-sm">
                          <div>
                            <div className="text-muted-foreground">Avg Score</div>
                            <div className="font-semibold text-success">{panchayat.avgScore}%</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Total Points</div>
                            <div className="font-semibold text-warning">{panchayat.totalPoints.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Quests Done</div>
                            <div className="font-semibold text-info">{panchayat.completedQuests}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Achievement Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="farming-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-badge-gold" />
              Achievement Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🥇</div>
                <div className="font-semibold">Top Performer</div>
                <div className="text-sm text-muted-foreground">Maintain #1 rank for 30 days</div>
                <Button variant="outline" size="sm" className="mt-2">
                  View Progress
                </Button>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🌟</div>
                <div className="font-semibold">Quest Master</div>
                <div className="text-sm text-muted-foreground">Complete 25 quests</div>
                <Button variant="outline" size="sm" className="mt-2">
                  View Progress
                </Button>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🚀</div>
                <div className="font-semibold">Level Up Legend</div>
                <div className="text-sm text-muted-foreground">Reach Level 10</div>
                <Button variant="outline" size="sm" className="mt-2">
                  View Progress
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}