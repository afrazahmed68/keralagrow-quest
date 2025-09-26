import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { motion } from "framer-motion";
import { Calendar, Trophy, Users, Clock } from "lucide-react";
import { Quest } from "@/store/questStore";
import { cn } from "@/lib/utils";

interface QuestCardProps {
  quest: Quest;
  onStart?: () => void;
  onContinue?: () => void;
  onViewDetails?: () => void;
  showProgress?: boolean;
  compact?: boolean;
}

const difficultyColors = {
  easy: 'bg-success text-success-foreground',
  medium: 'bg-warning text-warning-foreground',
  hard: 'bg-destructive text-destructive-foreground',
};

const categoryIcons = {
  soil: '🌱',
  water: '💧',
  biodiversity: '🦋',
  organic: '🌿',
  climate: '🌍',
};

export function QuestCard({ 
  quest, 
  onStart, 
  onContinue, 
  onViewDetails,
  showProgress = true,
  compact = false
}: QuestCardProps) {
  const isActive = quest.status === 'active' || quest.status === 'pending_approval';
  const isCompleted = quest.status === 'completed';
  const isPending = quest.status === 'pending_approval';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "quest-card cursor-pointer h-full",
        isCompleted && "border-success bg-success/5",
        isPending && "border-warning bg-warning/5",
        compact && "p-3"
      )}>
        <CardHeader className={cn("pb-3", compact && "pb-2")}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{quest.icon}</div>
              <div className="flex-1">
                <CardTitle className={cn(
                  "text-lg font-semibold",
                  compact && "text-base"
                )}>
                  {quest.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="secondary" 
                    className={difficultyColors[quest.difficulty]}
                  >
                    {quest.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {categoryIcons[quest.category]} {quest.category}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-sm font-medium text-warning">
                <Trophy className="h-4 w-4" />
                {quest.points}
              </div>
              {isCompleted && (
                <div className="text-2xl animate-bounce-in">🏆</div>
              )}
              {isPending && (
                <div className="text-xl animate-pulse-glow">⏳</div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className={cn("pt-0", compact && "px-3 pb-3")}>
          {!compact && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {quest.description}
            </p>
          )}
          
          {showProgress && isActive && (
            <div className="mb-4">
              <ProgressBar 
                value={quest.progress} 
                variant={isPending ? "warning" : "default"}
                label={`Progress: ${quest.progress}%`}
                animate
              />
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {quest.duration} days
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {quest.steps.length} steps
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {quest.status === 'available' && onStart && (
              <Button 
                onClick={onStart}
                className="flex-1 hero-button"
                size="sm"
              >
                Start Quest
              </Button>
            )}
            
            {isActive && onContinue && (
              <Button 
                onClick={onContinue}
                variant={isPending ? "secondary" : "default"}
                className="flex-1"
                size="sm"
              >
                {isPending ? 'Pending Approval' : 'Continue'}
              </Button>
            )}
            
            {isCompleted && (
              <Button 
                variant="outline"
                className="flex-1 border-success text-success"
                size="sm"
                disabled
              >
                ✅ Completed
              </Button>
            )}
            
            {onViewDetails && (
              <Button 
                onClick={onViewDetails}
                variant="outline"
                size="sm"
              >
                Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}