
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex">
        {/* Sidebar only shows on mobile and is toggled */}
        {isMobile && (
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        )}
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
