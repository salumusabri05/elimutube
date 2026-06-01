'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

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

  // Loading state to prevent flash of content during auth check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen w-full bg-[#060813] flex items-center justify-center">
        <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If on login page, just show the login page content without Sidebar / Navbar
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex w-full h-full z-10 relative">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-8 py-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
