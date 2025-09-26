import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { useQuestStore } from "@/store/questStore";
import { motion } from "framer-motion";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Plus,
  Users,
  Sprout,
  Calendar,
  Award,
  MapPin,
  Send
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Community() {
  const { user } = useAuthStore();
  const { communityPosts, addCommunityPost, likePost } = useQuestStore();
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  if (!user) return null;

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    
    setIsPosting(true);
    addCommunityPost(newPost.trim(), user.id, user.name);
    setNewPost('');
    setIsPosting(false);
  };

  const handleLikePost = (postId: string) => {
    likePost(postId);
  };

  const getBadgeDisplay = (badges: string[]) => {
    return badges.map((badge, index) => (
      <span key={index} className="text-lg">{badge}</span>
    ));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">
          Community Feed 🌾
        </h1>
        <p className="text-muted-foreground text-lg">
          Share your farming journey and connect with fellow farmers
        </p>
      </motion.div>

      {/* Community Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="farming-card text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">245</span>
              </div>
              <div className="text-sm text-muted-foreground">Active Farmers</div>
            </CardContent>
          </Card>
          
          <Card className="farming-card text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MessageSquare className="h-5 w-5 text-success" />
                <span className="text-2xl font-bold">{communityPosts.length}</span>
              </div>
              <div className="text-sm text-muted-foreground">Community Posts</div>
            </CardContent>
          </Card>
          
          <Card className="farming-card text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sprout className="h-5 w-5 text-warning" />
                <span className="text-2xl font-bold">156</span>
              </div>
              <div className="text-sm text-muted-foreground">Quests Shared</div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Create Post */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="farming-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Share Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-primary text-white">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="Share your farming achievements, ask questions, or inspire others..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {user.panchayat}
                  </div>
                  <Button
                    onClick={handleCreatePost}
                    disabled={!newPost.trim() || isPosting}
                    className="hero-button"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isPosting ? 'Posting...' : 'Share'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Community Posts */}
      <div className="space-y-6">
        {communityPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
          >
            <Card className="farming-card">
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" alt={post.farmerName} />
                    <AvatarFallback className="bg-gradient-success text-white">
                      {post.farmerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{post.farmerName}</h3>
                      <div className="flex items-center gap-1">
                        {getBadgeDisplay(post.badges)}
                      </div>
                      {post.farmerId === user.id && (
                        <Badge variant="secondary" className="text-xs">You</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                    </div>
                  </div>
                </div>

                {/* Quest Connection */}
                {post.questId && post.questTitle && (
                  <div className="mb-4">
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      <Award className="h-3 w-3 mr-1" />
                      Quest: {post.questTitle}
                    </Badge>
                  </div>
                )}

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-foreground leading-relaxed">{post.content}</p>
                </div>

                {/* Post Actions */}
                <div className="flex items-center gap-6 pt-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      post.hasLiked 
                        ? 'text-destructive hover:text-destructive/80' 
                        : 'text-muted-foreground hover:text-destructive'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${post.hasLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Comment</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="text-center"
      >
        <Button variant="outline" className="w-full max-w-md">
          Load More Posts
        </Button>
      </motion.div>

      {/* Community Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Community Guidelines 📋</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Share your sustainable farming experiences, ask for advice, and celebrate achievements together!
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-success">✅ Do Share</div>
                <div className="text-muted-foreground">Progress updates, tips, questions</div>
              </div>
              <div>
                <div className="font-medium text-warning">⚠️ Be Respectful</div>
                <div className="text-muted-foreground">Support fellow farmers kindly</div>
              </div>
              <div>
                <div className="font-medium text-info">💡 Stay Relevant</div>
                <div className="text-muted-foreground">Focus on farming and sustainability</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}