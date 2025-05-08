
import React, { useState } from 'react';
import { Menu, LogIn, LogOut, FileText, PenTool, CheckSquare, BookOpen, Settings, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import AuthModal from './AuthModal';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { currentUser, logout } = useAuth();
  const isMobile = useIsMobile();

  const categories = [
    { name: 'Dashboard', icon: Home, href: '/' },
    { name: 'PDF Tools', icon: FileText, href: '/pdf-converter' },
    { name: 'Web Dev Tools', icon: PenTool, href: '/webdev' },
    { name: 'Productivity', icon: CheckSquare, href: '/productivity' },
    { name: 'Study Materials', icon: BookOpen, href: '/study' },
    { name: 'Utility Tools', icon: Settings, href: '/utility' },
  ];

  const handleOpenAuthModal = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container flex h-14 items-center px-4 md:px-6">
          {/* Sidebar toggle for mobile */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          {/* Logo */}
          <div className="flex mr-4">
            <Link to="/" className="font-bold text-xl text-gradient">ZettaBox</Link>
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex-1 flex items-center space-x-1 md:space-x-2 lg:space-x-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.href}
                  className={cn(
                    "flex items-center px-2 py-1.5 text-sm font-medium rounded-md transition-colors",
                    window.location.pathname === category.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <category.icon className="mr-2 h-4 w-4" />
                  {category.name}
                </Link>
              ))}
            </nav>
          )}
          
          {/* User menu */}
          <div className="ml-auto flex items-center gap-2">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="rounded-full flex items-center gap-2"
                  >
                    <span className="hidden sm:inline-block font-medium">
                      {currentUser.email?.split('@')[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">
                    {currentUser.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  id="login-button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenAuthModal('login')}
                  className="hidden sm:flex"
                >
                  Log In
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleOpenAuthModal('signup')}
                  className="hidden sm:flex"
                >
                  Sign Up
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="sm:hidden rounded-full"
                  onClick={() => handleOpenAuthModal('login')}
                >
                  <LogIn className="h-5 w-5" />
                  <span className="sr-only">Log in</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={activeTab}
      />
    </>
  );
};

export default Navbar;
