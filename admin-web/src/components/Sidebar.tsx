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
} from 'lucide-react';

const menuGroups = [
  {
    title: 'Core Management',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Students', href: '/students', icon: GraduationCap },
      { name: 'Teachers', href: '/teachers', icon: Users },
      { name: 'Lessons', href: '/lessons', icon: BookOpen },
    ]
  },
  {
    title: 'Content & Learning',
    items: [
      { name: 'Quizzes', href: '/quizzes', icon: MessageSquare },
      { name: 'AI Summaries', href: '/ai-summaries', icon: Brain },
      { name: 'Captions', href: '/captions', icon: Subtitles },
      { name: 'Content Reports', href: '/content', icon: ShieldAlert },
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
    title: 'Analytics & System',
    items: [
      { name: 'Revenue Analytics', href: '/analytics', icon: TrendingUp },
      { name: 'Student Analytics', href: '/student-analytics', icon: BarChart3 },
      { name: 'Notifications', href: '/notifications', icon: Bell },
      { name: 'Database Explorer', href: '/database', icon: Database },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-68 theme-sidebar-bg backdrop-blur-xl theme-sidebar-text-primary border-r theme-sidebar-border h-full transition-colors duration-300">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-20 border-b theme-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 relative">
          <BookOpen className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 theme-sidebar-border animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none theme-sidebar-text-primary">
            ElimuTube
          </h1>
          <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold mt-1 block">
            Enterprise Admin
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-7">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider theme-sidebar-text-secondary px-3">
              {group.title}
            </h2>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 group relative ${
                        isActive 
                          ? 'bg-gradient-to-r from-indigo-600/15 to-violet-600/5 text-indigo-400 font-semibold border-l-2 border-indigo-500 pl-3.5' 
                          : 'theme-sidebar-text-secondary hover:theme-sidebar-text-primary theme-sidebar-item-hover border-l-2 border-transparent'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-indigo-400' : 'theme-sidebar-text-secondary group-hover:theme-sidebar-text-primary'
                      }`} />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Profile Footer */}
      <div className="p-4 border-t theme-sidebar-border theme-sidebar-footer-bg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/10">
            AD
          </div>
          <div>
            <p className="text-sm font-semibold theme-sidebar-text-primary">Admin Panel</p>
            <p className="text-xs theme-sidebar-text-secondary">Super Administrator</p>
          </div>
        </div>
        <Link 
          href="/settings"
          className="theme-sidebar-text-secondary hover:theme-sidebar-text-primary p-1.5 rounded-lg theme-sidebar-item-hover transition-colors"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
