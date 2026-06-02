'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Video, 
  CreditCard, 
  ShieldAlert,
  Bell,
  Settings,
  Database,
  GraduationCap,
  TrendingUp,
  MessageSquare,
  Brain,
  Subtitles,
  BarChart3,
  Wallet,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

const menuGroups = [
  {
    title: 'Core',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Students', href: '/students', icon: GraduationCap },
      { name: 'Teachers', href: '/teachers', icon: Users },
      { name: 'Lessons', href: '/lessons', icon: BookOpen },
    ]
  },
  {
    title: 'Content',
    items: [
      { name: 'Quizzes', href: '/quizzes', icon: MessageSquare },
      { name: 'AI Summaries', href: '/ai-summaries', icon: Brain },
      { name: 'Captions', href: '/captions', icon: Subtitles },
      { name: 'Reports', href: '/content', icon: ShieldAlert },
    ]
  },
  {
    title: 'Operations',
    items: [
      { name: 'Live Classes', href: '/live', icon: Video },
      { name: 'Subscriptions', href: '/subscriptions', icon: Wallet },
      { name: 'Payouts', href: '/payouts', icon: CreditCard },
      { name: 'Moderation', href: '/moderation', icon: ShieldAlert },
    ]
  },
  {
    title: 'Analytics',
    items: [
      { name: 'Revenue', href: '/analytics', icon: TrendingUp },
      { name: 'Student Insights', href: '/student-analytics', icon: BarChart3 },
      { name: 'Notifications', href: '/notifications', icon: Bell },
      { name: 'Database', href: '/database', icon: Database },
    ]
  }
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ collapsed, onToggle, isMobile, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<number, boolean>>(
    Object.fromEntries(menuGroups.map((_, i) => [i, true]))
  );

  const toggleSection = (idx: number) => {
    if (collapsed && !isMobile) return;
    setOpenSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleNavClick = () => {
    if (isMobile && onMobileClose) onMobileClose();
  };

  const isExpanded = isMobile ? true : !collapsed;

  return (
    <div className={`flex flex-col h-full theme-sidebar-bg backdrop-blur-2xl transition-all duration-300 relative ${
      isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'
    } ${isMobile ? 'sidebar-mobile-enter' : ''}`}
    style={{ boxShadow: '2px 0 24px 0 var(--shadow-color)' }}>

      {/* Brand Header */}
      <div className="flex items-center gap-3 px-4 h-16 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/15 relative flex-shrink-0">
          <BookOpen className="w-4 h-4 text-white" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-sm shadow-emerald-400/40 animate-pulse" />
        </div>
        {isExpanded && (
          <div className="sidebar-label">
            <h1 className="text-[15px] font-bold leading-none theme-sidebar-text-primary tracking-tight">
              ElimuTube
            </h1>
            <span className="text-[9px] uppercase tracking-[0.15em] text-indigo-400 font-semibold mt-0.5 block">
              Enterprise
            </span>
          </div>
        )}
      </div>

      {/* Tonal Divider */}
      <div className="tonal-divider mx-4" />

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-1">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-1">
            {/* Section Header */}
            {isExpanded ? (
              <button
                onClick={() => toggleSection(idx)}
                className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] theme-sidebar-text-secondary hover:theme-sidebar-text-primary rounded-lg transition-colors"
              >
                <span>{group.title}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openSections[idx] ? 'rotate-0' : '-rotate-90'}`} />
              </button>
            ) : (
              <div className="h-px mx-2 my-2 bg-[var(--surface-divider)]" />
            )}

            {/* Section Items */}
            {(openSections[idx] || !isExpanded) && (
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={handleNavClick}
                        title={collapsed && !isMobile ? item.name : undefined}
                        className={`flex items-center ${isExpanded ? 'px-3 py-2' : 'justify-center w-10 h-10 mx-auto'} rounded-xl transition-all duration-200 group relative ${
                          isActive 
                            ? 'bg-indigo-500/10 text-indigo-400 font-semibold' 
                            : 'theme-sidebar-text-secondary hover:theme-sidebar-text-primary theme-sidebar-item-hover'
                        }`}
                      >
                        {/* Active Indicator Dot */}
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-500 rounded-r-full" />
                        )}
                        <item.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                          isExpanded ? 'mr-2.5' : ''
                        } ${isActive ? 'text-indigo-400' : ''}`} />
                        {isExpanded && (
                          <span className="sidebar-label text-[13px]">{item.name}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {/* Tonal Divider */}
      <div className="tonal-divider mx-4" />

      {/* Footer */}
      <div className="p-3 theme-sidebar-footer-bg flex items-center justify-between flex-shrink-0">
        {isExpanded ? (
          <>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-indigo-600/10 flex-shrink-0">
                A
              </div>
              <div className="sidebar-label">
                <p className="text-xs font-semibold theme-sidebar-text-primary leading-tight">Admin</p>
                <p className="text-[10px] theme-sidebar-text-secondary leading-tight">Super Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link href="/settings" className="theme-sidebar-text-secondary hover:theme-sidebar-text-primary p-1.5 rounded-lg theme-sidebar-item-hover transition-colors">
                <Settings className="w-3.5 h-3.5" />
              </Link>
              <button onClick={onToggle} className="theme-sidebar-text-secondary hover:theme-sidebar-text-primary p-1.5 rounded-lg theme-sidebar-item-hover transition-colors hidden md:block" title="Collapse sidebar">
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <button onClick={onToggle} className="theme-sidebar-text-secondary hover:theme-sidebar-text-primary p-1.5 rounded-lg theme-sidebar-item-hover transition-colors mx-auto" title="Expand sidebar">
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
