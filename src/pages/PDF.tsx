import React, { useState } from 'react';
import { 
  FileText, 
  FilePlus, 
  FileSignature, 
  FileStack, 
  FileLock2, 
  FileSearch, 
  FileOutput, 
  FileInput,
  Clock,
  Star,
  ChevronRight,
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

const PDF: React.FC = () => {
  const { currentUser } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const featuredTools: Tool[] = [
    {
      title: 'PDF Merger & Splitter',
      description: 'Combine or split PDF files with ease',
      icon: FileStack,
      href: '/pdf-merger',
    },
    {
      title: 'Smart PDF Editor',
      description: 'Advanced PDF editing with AI-powered features',
      icon: FileSignature,
      href: '/pdf-editor',
      isComingSoon: true,
    },
    {
      title: 'PDF Converter Pro',
      description: 'Convert any document to and from PDF ',
      icon: FileOutput,
      href: '/pdf-converter',
      isLocked: !currentUser,
    },
  ];

  const quickTools: Tool[] = [
    {
      title: 'Compress PDF',
      description: 'Reduce file size while maintaining quality',
      icon: FilePlus,
      href: '/pdf-compress',
    },
    {
      title: 'Secure PDF',
      description: 'Add password protection and encryption',
      icon: FileLock2,
      href: '/pdf-security',
      isLocked: !currentUser,
    },
    {
      title: 'Image to PDF',
      description: 'Convert Image to Pdf documents',
      icon: FileInput,
      href: '/image-to-pdf',
      isComingSoon: true,
    },
  ];

  const recentFiles = [
    { name: 'Document1.pdf', date: '2 mins ago' },
    { name: 'Report.pdf', date: '1 hour ago' },
    { name: 'Contract.pdf', date: 'Yesterday' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header Section */}
      <header className="space-y-3 sm:space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold">PDF Tools</h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          Professional PDF tools to enhance your document workflow
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
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
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

      {/* Recent Files Section */}
      {currentUser && (
        <section>
          <Card>
            <CardHeader className="space-y-1.5 sm:space-y-2">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Recent Files
              </CardTitle>
              <CardDescription className="text-sm">
                Your recently processed PDF files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {recentFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <span className="text-sm sm:text-base">{file.name}</span>
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {file.date}
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
                  Unlock All Premium Features
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md">
                  Sign in to access advanced PDF tools, save your work history,
                  and process files without limitations.
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

export default PDF;