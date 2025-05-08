
import React from 'react';
import { cn } from '@/lib/utils';
import { FileText, PenTool, CheckSquare, BookOpen, Settings, Home, LogIn, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { currentUser, logout } = useAuth();
  
  const categories = [
    { name: 'Dashboard', icon: Home, href: '/' },
    { name: 'PDF Tools', icon: FileText, href: '/pdf-converter' },
    { name: 'Web Dev Tools', icon: PenTool, href: '/webdev' },
    { name: 'Productivity', icon: CheckSquare, href: '/productivity' },
    { name: 'Study Materials', icon: BookOpen, href: '/study' },
    { name: 'Utility Tools', icon: Settings, href: '/utility' },
  ];

  // If sidebar is clicked outside, close it
  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}
      
      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transition-transform duration-300 ease-in-out transform shadow-lg",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile sidebar header with close button */}
          <div className="h-14 border-b border-border flex items-center justify-between px-4">
            <Link to="/" className="font-bold text-xl text-gradient">ZettaBox</Link>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 pt-5 pb-8 px-4 space-y-1 overflow-y-auto scrollbar-none">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  window.location.pathname === category.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                <category.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {category.name}
              </Link>
            ))}
          </nav>
          
          {/* User status section */}
          <div className="px-4 py-5 border-t border-border">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div className="truncate">
                  <p className="text-sm font-medium truncate" title={currentUser.email || ''}>
                    {currentUser.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-muted-foreground">Logged In</p>
                </div>
                <Button 
                  className="text-xs px-3 py-1.5" 
                  variant="outline" 
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Guest Mode</p>
                  <p className="text-xs text-muted-foreground">Sign in to save your work</p>
                </div>
                <Button 
                  className="text-xs px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    setIsOpen(false);
                    document.getElementById('login-button')?.click();
                  }}
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
