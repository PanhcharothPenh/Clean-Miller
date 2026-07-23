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
  Bot
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
    { id: 'dashboard', label: t.dashboard, icon: BarChart3, roles: ['Owner', 'Admin', 'Manager', 'Staff'] },
    { id: 'reports', label: t.reports, icon: FileText, roles: ['Owner', 'Admin', 'Manager'] },
    { id: 'auditlogs', label: lang === 'en' ? 'Operational Audit Logs' : 'កំណត់ហេតុសវនកម្ម', icon: History, roles: ['Owner', 'Admin'] },
    
    { id: 'coins', label: lang === 'en' ? 'Coin Balance Ledger' : 'តុល្យភាពកាក់ក្នុងទូ', icon: Coins, roles: ['Owner', 'Admin', 'Manager', 'Staff'] },
    
    { id: 'revenues', label: lang === 'en' ? 'Clean24 Revenue Sheet' : 'សន្លឹកកត់ត្រាចំណូល Clean24 (កុងទ័រ)', icon: DollarSign, roles: ['Owner', 'Admin', 'Manager', 'Staff'] },
    { id: 'expense', label: t.expense, icon: CreditCard, roles: ['Owner', 'Admin', 'Manager'] },
    { id: 'monthclosing', label: lang === 'en' ? 'Month Financial Closing' : 'ការបិទបញ្ជីហិរញ្ញវត្ថុប្រចាំខែ', icon: FileCheck, roles: ['Owner', 'Admin'] },
    
    { id: 'staff', label: t.staff, icon: Users, roles: ['Owner', 'Admin'] },
    { id: 'attendance', label: t.attendance, icon: Calendar, roles: ['Owner', 'Admin', 'Manager'] },
    { id: 'salary', label: t.salary, icon: DollarSign, roles: ['Owner', 'Admin', 'Manager'] },
    
    { id: 'inventory', label: t.inventory, icon: Package, roles: ['Owner', 'Admin', 'Manager'] },
    { id: 'stock', label: lang === 'en' ? 'Operations Supply Stock' : 'ទំនិញឃ្លាំង', icon: Boxes, roles: ['Owner', 'Admin', 'Manager', 'Staff'] },
    { id: 'detergents', label: lang === 'en' ? 'Soap Level Reservoir' : 'ចំណុះសាប៊ូរាវ', icon: Droplets, roles: ['Owner', 'Admin', 'Manager', 'Staff'] },
    { id: 'softeners', label: lang === 'en' ? 'Softener Level Reservoir' : 'ចំណុះទឹកក្រអូប', icon: Sparkle, roles: ['Owner', 'Admin', 'Manager', 'Staff'] },
    { id: 'gas', label: lang === 'en' ? 'Gas Level Tracker' : 'ម៉ាស៊ីនហ្គាសសម្ងួត', icon: Flame, roles: ['Owner', 'Admin', 'Manager', 'Staff'] },
    { id: 'suppliers', label: lang === 'en' ? 'Suppliers Registry' : 'បញ្ជីអ្នកផ្គត់ផ្គង់', icon: Truck, roles: ['Owner', 'Admin', 'Manager'] },
    { id: 'debts', label: lang === 'en' ? 'Supplier Debts Ledger' : 'សៀវភៅបំណុលអ្នកផ្គត់ផ្គង់', icon: Wallet, roles: ['Owner', 'Admin', 'Manager'] },
    
    { id: 'branches', label: t.multiBranch, icon: Layers, roles: ['Owner'] },
    { id: 'settings', label: t.settings, icon: Settings, roles: ['Owner', 'Admin'] },
    { id: 'users', label: lang === 'en' ? 'User Accounts' : 'ការគ្រប់គ្រងគណនី', icon: UserCheck, roles: ['Owner', 'Admin'] },
    { id: 'telegram_config', label: lang === 'en' ? 'Config Telegram' : 'កំណត់រចនាសម្ព័ន្ធ Telegram', icon: Bot, roles: ['Owner', 'Admin', 'Manager'] }
  ];

  const navGroups = [
    {
      title: lang === 'en' ? 'Overview' : 'ទិដ្ឋភាពទូទៅ',
      icon: BarChart3,
      items: ['dashboard', 'reports', 'auditlogs']
    },
    {
      title: lang === 'en' ? 'Daily Tasks' : 'ការងារប្រចាំថ្ងៃ',
      icon: Calendar,
      items: ['softeners', 'detergents', 'revenues']
    },
    {
      title: lang === 'en' ? 'Financials' : 'ហិរញ្ញវត្ថុ',
      icon: DollarSign,
      items: ['expense', 'monthclosing']
    },
    {
      title: lang === 'en' ? 'Staff & Payroll' : 'បុគ្គលិក និងប្រាក់ខែ',
      icon: Users,
      items: ['staff', 'attendance', 'salary']
    },
    {
      title: lang === 'en' ? 'Inventory & Supplies' : 'ស្តុក និងអ្នកផ្គត់ផ្គង់',
      icon: Package,
      items: ['coins', 'inventory', 'stock', 'gas', 'suppliers', 'debts']
    },
    {
      title: lang === 'en' ? 'Administration' : 'ការគ្រប់គ្រងប្រព័ន្ធ',
      icon: Settings,
      items: ['branches', 'settings', 'users', 'telegram_config']
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
    <>
      {/* Mobile top bar */}
      <div className="md:hidden bg-white border-b border-slate-100 h-16 px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Clean24Logo className="h-7 cursor-pointer" lightMode={true} />
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-850 rounded-lg transition-colors"
          id="mobile_sidebar_trigger"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Floating or fixed sidebar container */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white text-slate-650 border-r border-slate-100 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 md:static md:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Header Branding Component */}
        <div className="p-4.5 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex flex-col gap-0.5">
              <Clean24Logo className="h-7.5 cursor-pointer" lightMode={true} />
              <span className="text-[7.5px] text-slate-400 font-bold tracking-widest uppercase block pl-0.5">PHNOM PENH, KH</span>
            </div>
            {/* Lang switcher */}
            <button 
              onClick={() => setLang(lang === 'en' ? 'kh' : 'en')}
              className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-slate-50 hover:bg-slate-100 hover:text-slate-850 border border-slate-200/60 text-slate-600 transition-colors cursor-pointer"
              id="lang_switch_btn"
            >
              {lang === 'en' ? 'KH 🇰🇭' : 'EN 🇺🇸'}
            </button>
          </div>

          {/* Active Branch Select Form */}
          <div className="mt-3.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <label className="text-[9px] text-slate-400 uppercase tracking-widest block mb-1 font-bold">
              {t.activeBranch}
            </label>
            <select
              value={activeBranchId}
              onChange={(e) => setActiveBranchId(e.target.value)}
              className="w-full bg-white border border-slate-200 text-xs text-slate-700 rounded-lg p-1.5 focus:outline-none focus:border-blue-600 font-sans cursor-pointer transition-colors"
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
        <div className="px-4 py-2 bg-white border-b border-slate-100">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'en' ? "Search menus..." : "ស្វែងរកមុខងារ..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-blue-600 font-sans transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[10px] text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Navigation Tabs list */}
        <div className="flex-1 overflow-y-auto px-3.5 pt-3 pb-12 space-y-4 custom-scrollbar bg-white">
          
          {/* Favorites Collapsible Group */}
          {favorites.length > 0 && (
            <div className="space-y-1 border-b border-slate-100/50 pb-3">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup('clean24_favorites_group')}
                className="w-full flex items-center justify-between px-2 py-1 text-xs font-black text-amber-500 uppercase tracking-widest hover:text-amber-600 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />
                  <span>{lang === 'en' ? 'Favorites' : 'សំណព្វចិត្ត'}</span>
                  <span className="text-[8px] text-amber-400 font-medium lowercase tracking-normal">
                    ({favoriteItems.length})
                  </span>
                </div>
                {favoritesExpanded ? <ChevronDown size={10} className="text-amber-500" /> : <ChevronRight size={10} className="text-amber-500" />}
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
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 py-2.5 px-3.5 focus:outline-none cursor-pointer group/item
                          ${active 
                            ? 'bg-blue-600 text-white font-semibold shadow-xs' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }
                        `}
                        id={`fav_tab_${item.id}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <item.icon size={18} className={active ? 'text-white' : 'text-slate-400 shrink-0'} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <span 
                          onClick={(e) => toggleFavorite(item.id, e)}
                          className="p-1 rounded-md hover:bg-slate-200/50 cursor-pointer transition-colors shrink-0"
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
                    <div className="text-left py-2 pl-3 text-[10px] text-slate-400 italic">
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
                  className="w-full flex items-center justify-between px-2 py-1 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <group.icon size={11} className="text-slate-400 shrink-0" />
                    <span>{group.title}</span>
                    <span className="text-[8px] text-slate-400 font-medium lowercase tracking-normal">
                      ({group.visibleItems.length})
                    </span>
                  </div>
                  {expanded ? <ChevronDown size={10} className="text-slate-400" /> : <ChevronRight size={10} className="text-slate-400" />}
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
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 py-2.5 px-3.5 focus:outline-none cursor-pointer group/item
                            ${active 
                              ? 'bg-blue-600 text-white font-semibold shadow-xs' 
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }
                          `}
                          id={`nav_tab_${item.id}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <item.icon size={18} className={active ? 'text-white' : 'text-slate-400 shrink-0'} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          <span 
                            onClick={(e) => toggleFavorite(item.id, e)}
                            className="p-1 rounded-md hover:bg-slate-200/50 cursor-pointer transition-colors shrink-0"
                          >
                            <Star 
                              size={16} 
                              className={favorites.includes(item.id) 
                                ? 'fill-amber-400 text-amber-400' 
                                : 'text-slate-350 opacity-0 group-hover/item:opacity-100 transition-opacity'
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
            <div className="text-center py-6 text-xs text-slate-400 italic">
              {lang === 'en' ? 'No menus match search' : 'រកមិនឃើញមុខងារដែលស្វែងរកទេ'}
            </div>
          )}
        </div>

      </aside>
      
      {/* Mobile background overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30 md:hidden"
        ></div>
      )}
    </>
  );
}
