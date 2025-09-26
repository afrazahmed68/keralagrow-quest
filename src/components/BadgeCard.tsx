import { Card, CardContent } from "@/components/ui/card";
import { Badge as BadgeComponent } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Badge } from "@/store/authStore";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  showDate?: boolean;
  animate?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: {
    card: 'p-3',
    icon: 'text-2xl',
    title: 'text-sm',
    desc: 'text-xs',
  },
  md: {
    card: 'p-4',
    icon: 'text-3xl',
    title: 'text-base',
    desc: 'text-sm',
  },
  lg: {
    card: 'p-6',
    icon: 'text-4xl',
    title: 'text-lg',
    desc: 'text-base',
  },
};

const typeStyles = {
  bronze: 'border-badge-bronze bg-gradient-to-br from-badge-bronze/10 to-badge-bronze/5',
  silver: 'border-badge-silver bg-gradient-to-br from-badge-silver/10 to-badge-silver/5',
  gold: 'border-badge-gold bg-gradient-to-br from-badge-gold/10 to-badge-gold/5',
};

const typeGlows = {
  bronze: 'shadow-[0_0_20px_hsl(var(--badge-bronze)/0.3)]',
  silver: 'shadow-[0_0_20px_hsl(var(--badge-silver)/0.3)]',
  gold: 'shadow-[0_0_20px_hsl(var(--badge-gold)/0.3)]',
};

export function BadgeCard({ 
  badge, 
  size = 'md', 
  showDate = true, 
  animate = true,
  className 
}: BadgeCardProps) {
  const sizes = sizeClasses[size];
  
  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const CardComponent = animate ? motion.div : 'div';
  const cardProps = animate ? {
    whileHover: { scale: 1.05, rotateY: 5 },
    whileTap: { scale: 0.95 },
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { 
      type: "spring" as const, 
      stiffness: 300, 
      damping: 20,
      delay: Math.random() * 0.2 
    }
  } : {};

  return (
    <CardComponent {...cardProps}>
      <Card 
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          typeStyles[badge.type],
          typeGlows[badge.type],
          "hover:scale-105",
          className
        )}
      >
        <CardContent className={cn("text-center", sizes.card)}>
          <div className="badge-glow">
            <div className={cn("mb-2", sizes.icon)}>
              {badge.icon}
            </div>
          </div>
          
          <h3 className={cn("font-semibold mb-1", sizes.title)}>
            {badge.name}
          </h3>
          
          <p className={cn("text-muted-foreground mb-2", sizes.desc)}>
            {badge.description}
          </p>
          
          <BadgeComponent 
            variant="secondary" 
            className={cn(
              "text-xs",
              badge.type === 'gold' && "bg-badge-gold/20 text-badge-gold border-badge-gold/30",
              badge.type === 'silver' && "bg-badge-silver/20 text-badge-silver border-badge-silver/30",
              badge.type === 'bronze' && "bg-badge-bronze/20 text-badge-bronze border-badge-bronze/30"
            )}
          >
            {badge.type.toUpperCase()}
          </BadgeComponent>
          
          {showDate && (
            <div className="text-xs text-muted-foreground mt-2">
              Earned {formatDate(badge.earnedAt)}
            </div>
          )}
        </CardContent>
        
        {/* Decorative corner accent */}
        <div className={cn(
          "absolute top-0 right-0 w-0 h-0 border-l-[20px] border-b-[20px] border-l-transparent",
          badge.type === 'gold' && "border-b-badge-gold/30",
          badge.type === 'silver' && "border-b-badge-silver/30",
          badge.type === 'bronze' && "border-b-badge-bronze/30"
        )} />
      </Card>
    </CardComponent>
  );
}