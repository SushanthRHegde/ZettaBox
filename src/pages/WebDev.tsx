import React, { useState } from 'react';
import { 
  Palette,
  Image as ImageIcon,
  Link2,
  Eraser,
  Star,
  Clock,
  FileLock2,
  LucideIcon
} from 'lucide-react';
import ToolCard from '@/components/ToolCard';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthModal from '@/components/AuthModal';

interface Tool {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  isLocked?: boolean;
  isComingSoon?: boolean;
}

const WebDev: React.FC = () => {
  const { currentUser } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const featuredTools: Tool[] = [
    {
      title: 'Color Picker & Palette',
      description: 'Generate beautiful color palettes',
      icon: Palette,
      href: '/color-tools',
    },
    {
      title: 'Image Compressor',
      description: 'Compress the size of images',
      icon: ImageIcon,
      href: '/image-compressor',
    },
    {
      title: 'Background Eraser',
      description: 'Remove backgrounds from images',
      icon: Eraser,
      href: '/bg-eraser',
      isLocked: !currentUser,
    },
  ];

  const quickTools: Tool[] = [
    {
      title: 'URL Shortener',
      description: 'Create short, memorable links instantly',
      icon: Link2,
      href: '/url-shortener',
    },
    {
      title: 'Gradient Generator',
      description: 'Create beautiful CSS gradients',
      icon: Palette,
      href: '/gradient-generator',
    },
    {
      title: 'Image Resizer',
      description: 'Resize images to any size',
      icon: ImageIcon,
      href: '/image-resizer',
      isLocked: !currentUser,
    },
  ];

  const recentProjects = [
    { name: 'Color Palette #1', date: '2 mins ago' },
    { name: 'Landing Page Assets', date: '1 hour ago' },
    { name: 'Project Links', date: 'Yesterday' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header Section */}
      <header className="space-y-3 sm:space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Web Dev Tools</h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          Essential tools to enhance your web development workflow
        </p>
      </header>

      {/* Featured Tools Section */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Featured Tools
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featuredTools.map((tool) => (
            <ToolCard
              key={tool.title}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              href={tool.href}
              isLocked={tool.isLocked}
              isComingSoon={tool.isComingSoon}
              onLockedClick={() => setAuthModalOpen(true)}
            />
          ))}
        </div>
      </section>

      {/* Quick Tools Grid */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <Palette className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Quick Tools
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {quickTools.map((tool) => (
            <ToolCard
              key={tool.title}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              href={tool.href}
              isLocked={tool.isLocked}
              isComingSoon={tool.isComingSoon}
              onLockedClick={() => setAuthModalOpen(true)}
            />
          ))}
        </div>
      </section>

      {/* Recent Projects Section */}
      {currentUser && (
        <section>
          <Card>
            <CardHeader className="space-y-1.5 sm:space-y-2">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Recent Projects
              </CardTitle>
              <CardDescription className="text-sm">
                Your recently used web development tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.name}
                    className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <span className="text-sm sm:text-base">{project.name}</span>
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {project.date}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Call to Action for Non-logged In Users */}
      {!currentUser && (
        <section>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <FileLock2 className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                <h3 className="text-xl sm:text-2xl font-semibold">
                  Unlock Premium Web Dev Tools
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md">
                  Sign in to access advanced features, save your projects,
                  and use premium web development tools without limitations.
                </p>
                <button 
                  className="bg-primary text-primary-foreground px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg hover:bg-primary/90 transition-colors"
                  onClick={() => setAuthModalOpen(true)}
                >
                  Sign In
                </button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="login"
      />
    </div>
  );
};

export default WebDev; 