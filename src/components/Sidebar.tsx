/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart3, 
  Layers, 
  Users, 
  DollarSign, 
  Calendar, 
  Coins, 
  CreditCard, 
  Wrench, 
  Package, 
  FileText, 
  Settings, 
  ShieldCheck,
  UserCheck,
  Menu,
  X,
  Flame,
  Droplets,
  Sparkle,
  Boxes,
  Truck,
  Lock,
  Wallet,
  FileCheck,
  History,
  LogOut,
  ChevronDown,
  ChevronRight,
  Search,
  Star,
  Send,
  Bot,
  Activity
} from 'lucide-react';
import { Role, User, Branch } from '../types';
import { translations } from '../mockData';
import Clean24Logo from './Clean24Logo';

interface SidebarProps {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  activeBranchId: string;
  setActiveBranchId: (id: string) => void;
  branches: Branch[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'en' | 'kh';
  setLang: (lang: 'en' | 'kh') => void;
  exchangeRate: number;
  onLogout?: () => void;
}

export default function Sidebar({
  currentRole,
  setCurrentRole,
  currentUser,
  setCurrentUser,
  users,
  activeBranchId,
  setActiveBranchId,
  branches,
  activeTab,
  setActiveTab,
  lang,
  setLang,
  onLogout
}: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('clean24_favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => typeof item === 'string');
        }
      }
    } catch {
      // safe fallback
    }
    return [];
  });

  const toggleFavorite = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const updated = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      localStorage.setItem('clean24_favorites', JSON.stringify(updated));
      return updated;
    });
  };
  
  const t = translations[lang];

  // Navigation Items Definitions
    const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, roles: ['Owner', 'Admin', 'Manager', 'Staff'] },
    { id: 'branches', label: 'Branches', icon: Layers, roles: ['Owner'] },
    { id: 'reports', label: 'Reports', icon: FileText, roles: ['Owner', 'Admin', 'Manager'] },
    { id: 'softeners', label: 'Daily Operations', icon: Activity, roles: ['Owner', 'Admin', 'Manager', 'Staff'] },
    { id: 'expense', label: 'Financials', icon: DollarSign, roles: ['Owner', 'Admin', 'Manager'] },
    
    { id: 'detergents', label: 'Soap & Softener', icon: Droplets, roles: ['Owner', 'Admin', 'Manager', 'Staff'] },
    { id: 'inventory', label: 'Inventory', icon: Package, roles: ['Owner', 'Admin', 'Manager'] },
    { id: 'suppliers', label: 'Suppliers', icon: Truck, roles: ['Owner', 'Admin', 'Manager'] },
    { id: 'stock', label: 'Stock History', icon: History, roles: ['Owner', 'Admin', 'Manager', 'Staff'] },
    
    { id: 'staff', label: 'Staff Management', icon: Users, roles: ['Owner', 'Admin'] },
    { id: 'attendance', label: 'Attendance', icon: Calendar, roles: ['Owner', 'Admin', 'Manager'] },
    { id: 'salary', label: 'Payroll', icon: CreditCard, roles: ['Owner', 'Admin', 'Manager'] },
    
    { id: 'users', label: 'Users & Roles', icon: UserCheck, roles: ['Owner', 'Admin'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['Owner', 'Admin'] },
    { id: 'auditlogs', label: 'Audit Logs', icon: FileCheck, roles: ['Owner', 'Admin'] }
  ];

    const navGroups = [
    {
      title: 'MAIN',
      icon: BarChart3,
      items: ['dashboard', 'branches', 'reports', 'softeners', 'expense']
    },
    {
      title: 'INVENTORY & SUPPLIES',
      icon: Package,
      items: ['detergents', 'inventory', 'suppliers', 'stock']
    },
    {
      title: 'STAFF & PAYROLL',
      icon: Users,
      items: ['staff', 'attendance', 'salary']
    },
    {
      title: 'SYSTEM',
      icon: Settings,
      items: ['users', 'settings', 'auditlogs']
    }
  ];

  // Helper to filter branches accessible by selected user role
  const getAccessibleBranches = () => {
    if (currentRole === 'Owner') return branches;
    if (currentRole === 'Admin') {
      return branches.filter(b => b.id === 'b1' || b.id === 'b2');
    }
    return branches.filter(b => b.id === 'b1');
  };

  const accessibleBranches = getAccessibleBranches();

  // Handle physical user swap when switching simulated roles
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextRole = e.target.value as Role;
    setCurrentRole(nextRole);
    
    const match = users.find(u => u.role === nextRole);
    if (match) {
      setCurrentUser(match);
    }

    if (nextRole === 'Manager' || nextRole === 'Staff') {
      setActiveBranchId('b1');
    } else if (nextRole === 'Admin') {
      setActiveBranchId('b1');
    } else {
      setActiveBranchId('all');
    }
  };

  const toggleGroup = (groupTitle: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }));
  };

  const isGroupExpanded = (groupTitle: string) => {
    if (searchQuery.trim() !== '') return true;
    return !collapsedGroups[groupTitle];
  };

  // Filter groups and items based on search and roles
  const filteredGroups = navGroups.map(group => {
    const visibleItems = group.items
      .map(itemId => navItems.find(item => item.id === itemId))
      .filter((item): item is typeof navItems[0] => {
        if (!item) return false;
        
        // Check role access
        const hasAccess = item.roles.includes(currentRole);
        if (!hasAccess) return false;
        
        // Check search query
        if (searchQuery.trim() === '') return true;
        const query = searchQuery.toLowerCase();
        return (
          item.label.toLowerCase().includes(query) ||
          group.title.toLowerCase().includes(query)
        );
      });

    return {
      ...group,
      visibleItems
    };
  }).filter(group => group.visibleItems.length > 0);

  // Filter favorites based on search, role, and active selections
  const favoriteItems = navItems.filter(item => {
    if (!favorites.includes(item.id)) return false;
    const hasAccess = item.roles.includes(currentRole);
    if (!hasAccess) return false;
    if (searchQuery.trim() === '') return true;
    const query = searchQuery.toLowerCase();
    return item.label.toLowerCase().includes(query);
  });

  const favoritesExpanded = isGroupExpanded('clean24_favorites_group');

  return (
    <aside className="w-full h-full bg-[#E7EEFF] text-[#111827] border-r border-blue-200/70 flex flex-col justify-between overflow-hidden shadow-xs">
        {/* Top Header Branding Component */}
        <div className="pt-3 pb-3 px-4 border-b border-blue-200/60 bg-[#E7EEFF] relative">
          
          {/* Centered Well-Proportioned Logo Component (No text overlap, clean transparent 3D logo) */}
          <div className="flex flex-col items-center justify-center text-center my-1">
            <Clean24Logo className="h-14 sm:h-16 cursor-pointer justify-center" lightMode={true} />
          </div>

          {/* Active Branch Select Form */}
          <div className="mt-3 bg-white/90 p-2.5 rounded-xl border border-blue-200/80 shadow-2xs">
            <label className="text-[9px] text-[#4B5563] uppercase tracking-widest block mb-1 font-bold">
              {t.activeBranch}
            </label>
            <select
              value={activeBranchId}
              onChange={(e) => setActiveBranchId(e.target.value)}
              className="w-full bg-white border border-slate-200 text-xs text-[#111827] rounded-lg p-1.5 focus:outline-none focus:border-[#003D9B] font-sans cursor-pointer transition-colors font-semibold"
              id="sidebar_branch_selector"
            >
              {currentRole === 'Owner' && (
                <option value="all">🌐 {t.allBranches}</option>
              )}
              {accessibleBranches.map(b => (
                <option key={b.id} value={b.id}>
                  📍 {b.branchName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search menu filter bar */}
        <div className="px-4 py-2.5 bg-[#E7EEFF] border-b border-blue-200/60">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-2.5 text-[#4B5563]" />
            <input
              type="text"
              placeholder={lang === 'en' ? "Search menus..." : "ស្វែងរកមុខងារ..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-blue-200/80 text-xs text-[#111827] placeholder-slate-400 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#003D9B] font-sans transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[10px] text-[#4B5563] hover:text-[#111827] cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Navigation Tabs list */}
        <div className="flex-1 overflow-y-auto px-3 pt-3 pb-10 space-y-4 custom-scrollbar bg-[#E7EEFF]">
          
          {/* Favorites Collapsible Group */}
          {favorites.length > 0 && (
            <div className="space-y-1 border-b border-blue-200/60 pb-3">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup('clean24_favorites_group')}
                className="w-full flex items-center justify-between px-2 py-1 text-xs font-black text-[#92400E] uppercase tracking-widest hover:text-amber-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Star size={11} className="fill-[#92400E] text-[#92400E] shrink-0" />
                  <span>{lang === 'en' ? 'Favorites' : 'សំណព្វចិត្ត'}</span>
                  <span className="text-[8px] text-[#92400E] font-medium lowercase tracking-normal">
                    ({favoriteItems.length})
                  </span>
                </div>
                {favoritesExpanded ? <ChevronDown size={10} className="text-[#92400E]" /> : <ChevronRight size={10} className="text-[#92400E]" />}
              </button>

              {/* Group Items */}
              {favoritesExpanded && (
                <div className="space-y-0.5 pl-1.5 fade-in-slide">
                  {favoriteItems.map((item) => {
                    const active = activeTab === item.id;
                    return (
                      <button
                        key={`fav-${item.id}`}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 focus:outline-none cursor-pointer group/item
                          ${active 
                            ? 'bg-[#0052CC] text-white font-bold shadow-md' 
                            : 'text-[#4B5563] hover:bg-blue-100/70 hover:text-[#111827]'
                          }
                        `}
                        id={`fav_tab_${item.id}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <item.icon size={18} className={active ? 'text-white' : 'text-[#003D9B] shrink-0'} />
                          <span className="truncate text-xs font-bold flex-1 text-left">{item.label}</span>
                        </div>
                        <span 
                          onClick={(e) => toggleFavorite(item.id, e)}
                          className="p-1 rounded-md hover:bg-blue-200/50 cursor-pointer transition-colors shrink-0"
                        >
                          <Star 
                            size={16} 
                            className="fill-amber-400 text-amber-400" 
                          />
                        </span>
                      </button>
                    );
                  })}
                  {favoriteItems.length === 0 && (
                    <div className="text-left py-2 pl-3 text-[10px] text-[#4B5563] italic">
                      {lang === 'en' ? 'No matching favorites' : 'រកមិនឃើញចំណូលចិត្តដែលស្វែងរកទេ'}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {filteredGroups.map((group) => {
            const expanded = isGroupExpanded(group.title);
            return (
              <div key={group.title} className="space-y-1">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-2 py-1 text-xs font-black text-[#4B5563] uppercase tracking-widest hover:text-[#111827] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <group.icon size={11} className="text-[#0052CC] shrink-0" />
                    <span>{group.title}</span>
                    <span className="text-[8px] text-[#4B5563] font-medium lowercase tracking-normal">
                      ({group.visibleItems.length})
                    </span>
                  </div>
                  {expanded ? <ChevronDown size={10} className="text-[#4B5563]" /> : <ChevronRight size={10} className="text-[#4B5563]" />}
                </button>

                {/* Group Items */}
                {expanded && (
                  <div className="space-y-0.5 pl-1.5 fade-in-slide">
                    {group.visibleItems.map((item) => {
                      const active = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id as any);
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 focus:outline-none cursor-pointer group/item
                            ${active 
                              ? 'bg-[#0052CC] text-white font-bold shadow-md' 
                              : 'text-[#4B5563] hover:bg-blue-100/70 hover:text-[#111827]'
                            }
                          `}
                          id={`nav_tab_${item.id}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <item.icon size={18} className={active ? 'text-white' : 'text-[#003D9B] shrink-0'} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          <span 
                            onClick={(e) => toggleFavorite(item.id, e)}
                            className="p-1 rounded-md hover:bg-blue-200/50 cursor-pointer transition-colors shrink-0"
                          >
                            <Star 
                              size={16} 
                              className={favorites.includes(item.id) 
                                ? 'fill-amber-400 text-amber-400' 
                                : 'text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity'
                              } 
                            />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {filteredGroups.length === 0 && (
            <div className="text-center py-6 text-xs text-[#4B5563] italic">
              {lang === 'en' ? 'No menus match search' : 'រកមិនឃើញមុខងារដែលស្វែងរកទេ'}
            </div>
          )}
        </div>

        {/* Sidebar Collapse Footer Bar */}
        <div className="p-3 border-t border-blue-200/60 bg-[#E7EEFF] flex items-center justify-between text-xs font-bold text-[#4B5563] shrink-0">
          <button 
            type="button" 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 hover:text-[#111827] cursor-pointer transition-colors"
          >
            <ChevronRight size={14} className="rotate-180" />
            <span>Collapse</span>
          </button>
          <span className="text-[10px] text-slate-400 font-mono">v2.0.0</span>
        </div>

      </aside>
  );
}
