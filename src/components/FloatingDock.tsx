import React from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, PenTool, CheckSquare, BookOpen, Settings } from 'lucide-react';

const FloatingDock = () => {
  const categories = [
    { name: 'Dashboard', icon: Home, href: '/' },
    { name: 'PDF Tools', icon: FileText, href: '/pdf' },
    { name: 'Web Dev Tools', icon: PenTool, href: '/webdev' },
    { name: 'Productivity', icon: CheckSquare, href: '/productivity' },
    { name: 'Study Materials', icon: BookOpen, href: '/study' },
    { name: 'Utility Tools', icon: Settings, href: '/utility' },
  ];
  const location = useLocation();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] block md:hidden">
      <div className="flex items-center gap-2 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 py-2 rounded-full border border-border shadow-lg">
        {categories.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
              location.pathname === item.href
                ? "bg-primary/10"
                : "hover:bg-accent"
            )}
            title={item.name}
          >
            <item.icon 
              className={cn(
                "h-5 w-5",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-foreground"
              )} 
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FloatingDock;