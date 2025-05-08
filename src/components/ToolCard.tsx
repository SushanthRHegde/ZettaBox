
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  isLocked?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({
  icon: Icon,
  title,
  description,
  href,
  isLocked = false,
}) => {
  return (
    <a
      href={href}
      className={cn(
        "relative flex flex-col rounded-lg border border-border p-5 transition-colors hover:bg-accent/50",
        "group backdrop-blur-sm",
        isLocked ? "opacity-80 hover:cursor-not-allowed" : "hover:cursor-pointer"
      )}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card group-hover:border-primary/50">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-card/80 backdrop-blur">
          <div className="text-center">
            <p className="text-sm font-medium">Sign in to unlock</p>
            <button className="mt-2 text-xs px-3 py-1 rounded bg-primary text-primary-foreground">
              Login
            </button>
          </div>
        </div>
      )}
    </a>
  );
};

export default ToolCard;
