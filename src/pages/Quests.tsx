import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestCard } from "@/components/QuestCard";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useAuthStore } from "@/store/authStore";
import { useQuestStore, Quest } from "@/store/questStore";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Trophy, 
  Target, 
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin
} from "lucide-react";

const categories = ['all', 'soil', 'water', 'biodiversity', 'organic', 'climate'];
const difficulties = ['all', 'easy', 'medium', 'hard'];

const categoryColors = {
  soil: 'bg-success/10 text-success border-success/20',
  water: 'bg-info/10 text-info border-info/20',
  biodiversity: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  organic: 'bg-warning/10 text-warning border-warning/20',
  climate: 'bg-green-600/10 text-green-600 border-green-600/20',
};

export default function Quests() {
  const { user } = useAuthStore();
  const { quests, getActiveQuests, getAvailableQuests, startQuest, updateQuestProgress } = useQuestStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  if (!user) return null;

  const activeQuests = getActiveQuests(user.id);
  const availableQuests = getAvailableQuests(user.id);
  const completedQuests = quests.filter(q => q.status === 'completed' && q.farmerId === user.id);

  const filterQuests = (questList: Quest[]) => {
    return questList.filter(quest => {
      const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quest.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || quest.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || quest.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  };

  const filteredAvailable = filterQuests(availableQuests);
  const filteredActive = filterQuests(activeQuests);
  const filteredCompleted = filterQuests(completedQuests);

  const handleStartQuest = (questId: string) => {
    startQuest(questId, user.id);
  };

  const handleUpdateProgress = (questId: string, stepId: string) => {
    updateQuestProgress(questId, stepId, 'Progress updated by farmer');
  };

  const getTotalStats = () => {
    const total = quests.length;
    const completed = completedQuests.length;
    const active = activeQuests.length;
    const available = availableQuests.length;
    
    return { total, completed, active, available };
  };

  const stats = getTotalStats();

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
          Quest Hub 🗺️
        </h1>
        <p className="text-muted-foreground text-lg">
          Embark on sustainable farming adventures and earn rewards
        </p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="farming-card text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Quests</div>
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
              <div className="text-2xl font-bold text-warning">{stats.active}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="farming-card text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
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
              <div className="text-2xl font-bold text-info">{stats.available}</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="farming-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Quests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search quests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Category:</span>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-gradient-primary" : ""}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Difficulty:</span>
                  {difficulties.map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant={selectedDifficulty === difficulty ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={selectedDifficulty === difficulty ? "bg-gradient-primary" : ""}
                    >
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quest Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Available ({filteredAvailable.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Active ({filteredActive.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed ({filteredCompleted.length})
            </TabsTrigger>
          </TabsList>

          {/* Available Quests */}
          <TabsContent value="available" className="mt-6">
            {filteredAvailable.length === 0 ? (
              <Card className="farming-card">
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Available Quests</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all'
                      ? 'Try adjusting your filters to see more quests.'
                      : 'All quests have been started or completed!'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAvailable.map((quest, index) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <QuestCard
                      quest={quest}
                      onStart={() => handleStartQuest(quest.id)}
                      showProgress={false}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Active Quests */}
          <TabsContent value="active" className="mt-6">
            {filteredActive.length === 0 ? (
              <Card className="farming-card">
                <CardContent className="p-12 text-center">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Quests</h3>
                  <p className="text-muted-foreground">
                    Start some quests from the Available tab to begin your sustainable farming journey!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActive.map((quest, index) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <QuestCard
                      quest={quest}
                      onContinue={() => {
                        // Simulate progress update for demo
                        const incompleteStep = quest.steps.find(step => !step.completed);
                        if (incompleteStep) {
                          handleUpdateProgress(quest.id, incompleteStep.id);
                        }
                      }}
                      showProgress={true}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Completed Quests */}
          <TabsContent value="completed" className="mt-6">
            {filteredCompleted.length === 0 ? (
              <Card className="farming-card">
                <CardContent className="p-12 text-center">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Completed Quests Yet</h3>
                  <p className="text-muted-foreground">
                    Complete your first quest to see your achievements here!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
                    🏆 {filteredCompleted.length} Quests Completed
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompleted.map((quest, index) => (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <QuestCard
                        quest={quest}
                        showProgress={true}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}