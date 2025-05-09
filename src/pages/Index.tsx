import React, { useEffect, useState } from 'react';
import ToolCard from '@/components/ToolCard';
import CategorySection from '@/components/CategorySection';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import { 
  FileText, PenTool, CheckSquare, BookOpen, Settings, Palette, 
  FileImage, Link, Clock, Smile, Compass, Lock, Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const { currentUser } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Mock recently used tools (in a real app, this would come from localStorage or user data)
  const recentTools = [
    {
      title: 'PDF Converter',
      description: 'Convert documents to and from PDF',
      icon: FileText,
      href: '/pdf-converter',
    },
    {
      title: 'To-Do List',
      description: 'Organize your tasks and priorities',
      icon: CheckSquare,
      href: '/todo',
    },
    {
      title: 'Color Picker',
      description: 'Find and generate color palettes',
      icon: Palette,
      href: '/color-picker',
    }
  ];

  // Tool categories with featured tools
  const pdfTools = [
    {
      title: 'PDF Converter',
      description: 'Convert documents to and from PDF',
      icon: FileText,
      href: '/pdf-converter',
    },
    {
      title: 'PDF Merger',
      description: 'Combine multiple PDFs into one document',
      icon: FileText,
      href: '/pdf-merger',
    },
    {
      title: 'PDF Editor',
      description: 'Edit text, add signatures and annotations',
      icon: FileText,
      href: '/pdf-editor',
      isLocked: !currentUser,
    }
  ];

  const webDevTools = [
    {
      title: 'Color Picker',
      description: 'Find and generate color palettes',
      icon: Palette,
      href: '/color-picker',
    },
    {
      title: 'Image Tools',
      description: 'Resize, compress, and edit images',
      icon: FileImage,
      href: '/image-tools',
    },
    {
      title: 'URL Shortener',
      description: 'Create shortened links for sharing',
      icon: Link,
      href: '/url-shortener',
    }
  ];

  const productivityTools = [
    {
      title: 'To-Do List',
      description: 'Organize your tasks and priorities',
      icon: CheckSquare,
      href: '/todo',
    },
    {
      title: 'Pomodoro Timer',
      description: 'Boost productivity with timed work sessions',
      icon: Clock,
      href: '/pomodoro',
    },
    {
      title: 'Task Scheduler',
      description: 'Schedule tasks and reminders',
      icon: Clock,
      href: '/scheduler',
      isLocked: !currentUser,
    }
  ];

  // Generate a guest ID for local storage if not exists and user is not logged in
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setIsGuest(false);
    } else {
      setIsGuest(true);
      const guestId = localStorage.getItem('zettabox_guest_id');
      if (!guestId) {
        const newGuestId = `guest_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('zettabox_guest_id', newGuestId);
      }
    }
  }, [currentUser]);

  return (
    <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to ZettaBox{currentUser ? `, ${currentUser.email?.split('@')[0]}` : ''}</h1>
          <p className="text-muted-foreground">All your productivity tools in one place</p>
        </header>

        {isGuest && (
          <div className="mb-8 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center">
              <div className="mr-4 bg-primary/10 p-2 rounded-full">
                <Smile className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">You're in Guest Mode</h3>
                <p className="text-sm text-muted-foreground">Sign in to save your tools and preferences</p>
              </div>
              <Button 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Sign In
              </Button>
            </div>
          </div>
        )}

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)}
          defaultTab="login"
        />

        {/* Recently Used Section */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Recently Used</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentTools.map((tool) => (
              <ToolCard
                key={tool.title}
                icon={tool.icon}
                title={tool.title}
                description={tool.description}
                href={tool.href}
              />
            ))}
          </div>
        </section>

        {/* Categories */}
        <CategorySection 
          title="PDF Tools" 
          viewAllHref="/pdf"
          tools={pdfTools}
        />
        
        <CategorySection 
          title="Web Development Tools" 
          viewAllHref="/webdev"
          tools={webDevTools} 
        />
        
        <CategorySection 
          title="Productivity Tools" 
          viewAllHref="/productivity"
          tools={productivityTools} 
        />

        {/* Premium Banner */}
        <div className="mt-12 p-6 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 flex items-center">
              <div className="mr-4 bg-primary/20 p-3 rounded-full">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Unlock Premium Tools</h3>
                <p className="text-muted-foreground">Access advanced features and remove limits</p>
              </div>
            </div>
            <Button className="bg-primary text-primary-foreground px-5 py-2 rounded-md font-medium flex items-center">
              <Lock className="mr-2 h-4 w-4" />
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
  );
};

export default Index;
