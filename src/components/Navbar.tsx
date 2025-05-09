import React, { useState } from 'react';
import { Menu, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import AuthModal from './AuthModal';
import { Button } from './ui/button';
import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const categories = [
    { name: 'Home', href: '/' },
    { name: 'PDF', href: '/pdf' },
    { name: 'Web Dev', href: '/webdev' },
    { name: 'Productivity', href: '/productivity' },
    { name: 'Study', href: '/study' },
    { name: 'Utility', href: '/utility' },
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
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="font-bold text-lg sm:text-xl tracking-tight hover:text-primary transition-colors">
              ZettaBox
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex-1 flex justify-center">
              <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.href}
                    className={cn(
                      "flex items-center px-2 lg:px-3 py-2 text-sm font-medium rounded-md transition-colors hover:text-primary",
                      location.pathname === category.href
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    {category.name}
                  </Link>
                ))}

                {/* User Menu integrated with nav items */}
                <div className="ml-2">
                  {currentUser ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="hover:bg-accent/50 flex items-center gap-2"
                        >
                          <User className="h-5 w-5" />
                          <span className="hidden md:inline-block font-medium">
                            {currentUser.displayName || currentUser.email?.split('@')[0]}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="truncate">
                          {currentUser.displayName || currentUser.email}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenAuthModal('login')}
                      className="hover:bg-accent/50"
                    >
                      Log in
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <div className="flex items-center">
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-accent/50 flex items-center gap-2"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="truncate">
                      {currentUser.displayName || currentUser.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenAuthModal('login')}
                  className="hover:bg-accent/50"
                >
                  Log in
                </Button>
              )}
            </div>
          )}
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