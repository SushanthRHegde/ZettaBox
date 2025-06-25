import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  isLocked?: boolean;
  isComingSoon?: boolean;
  onLockedClick?: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({
  icon: Icon,
  title,
  description,
  href,
  isLocked = false,
  isComingSoon = false,
  onLockedClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (isLocked && onLockedClick) {
      e.preventDefault();
      onLockedClick();
    }
    if (isComingSoon) {
      e.preventDefault();
    }
  };

  return (
    <Link
      to={href}
      onClick={handleClick}
      className={cn(
        "relative flex flex-col rounded-lg border border-border p-5 transition-colors hover:bg-accent/50",
        "group backdrop-blur-sm min-h-[160px]",
        (isLocked || isComingSoon) ? "opacity-80" : "hover:cursor-pointer"
      )}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card group-hover:border-primary/50">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      
      <h3 className="mb-1 text-lg font-semibold line-clamp-1">{title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-card/80 backdrop-blur">
          <div className="text-center px-4">
            <p className="text-sm font-medium">Sign in to unlock</p>
            <button 
              className="mt-2 text-xs px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                onLockedClick?.();
              }}
            >
              Login
            </button>
          </div>
        </div>
      )}

      {isComingSoon && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-card/80 backdrop-blur">
          <div className="text-center px-4">
            <p className="text-sm font-medium">Coming Soon</p>
            <button 
              className="mt-2 text-xs px-3 py-1 rounded bg-primary text-primary-foreground opacity-50 cursor-not-allowed"
              disabled
            >
              Stay Tuned
            </button>
          </div>
        </div>
      )}
    </Link>
  );
};

export default ToolCard;
