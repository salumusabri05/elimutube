'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width < 1024 && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      } else if (width >= 1024 && sidebarCollapsed && !isMobile) {
        setSidebarCollapsed(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarCollapsed, isMobile]);

  useEffect(() => {
    // Check if admin is authenticated (mock auth using localStorage)
    const authStatus = localStorage.getItem('isAdminAuthenticated');
    
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      if (pathname === '/login') {
        router.push('/');
      }
    } else {
      setIsAuthenticated(false);
      if (pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [pathname, router]);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileMenuOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  }, [isMobile]);

  // Loading state to prevent flash of content during auth check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen w-full bg-[var(--background)] flex items-center justify-center">
        <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If on login page, just show the login page content without Sidebar / Navbar
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex w-full h-full z-10 relative overflow-hidden bg-[var(--background)]">
      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      {/* Sidebar Container */}
      <div className={`
        h-full flex-shrink-0
        ${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out sidebar-expanded' : 'relative z-20 overflow-hidden'}
        ${isMobile && !mobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
        ${!isMobile && (sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded')}
      `}>
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={toggleSidebar}
          isMobile={isMobile}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Navbar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8 relative w-full scroll-smooth">
          <div className="max-w-[1600px] mx-auto w-full">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}
