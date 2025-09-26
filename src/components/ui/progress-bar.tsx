import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'info';
  animate?: boolean;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className, 
  showLabel = true, 
  label,
  variant = 'default',
  animate = true
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-gradient-success';
      case 'warning':
        return 'bg-gradient-earth';
      case 'info':
        return 'bg-gradient-sky';
      default:
        return 'bg-gradient-primary';
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">
            {label || `${Math.round(percentage)}%`}
          </span>
          {showLabel && !label && (
            <span className="text-sm text-muted-foreground">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className="progress-bar h-3">
        <div
          className={cn(
            "progress-fill",
            getVariantClasses(),
            animate && "transition-all duration-1000 ease-out"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}