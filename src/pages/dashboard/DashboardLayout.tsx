import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { dashboardMenu } from './config';

interface DashboardLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export default function DashboardLayout({ activeTab, setActiveTab, children }: DashboardLayoutProps) {
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
    <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans" dir="rtl">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-xl font-bold text-gray-900">لوحة تحكم الموقع</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        w-full md:w-72 bg-white border-l border-gray-200 flex flex-col h-[calc(100vh-64px)] md:h-screen fixed md:sticky top-[64px] md:top-0 z-20 transition-transform duration-300 overflow-y-auto
      `}>
        <div className="p-6 border-b border-gray-200 hidden md:block">
          <h1 className="text-xl font-bold text-gray-900">لوحة تحكم الموقع</h1>
        </div>
        
        <div className="flex-1 py-4">
          {dashboardMenu.map((group, idx) => (
            <div key={idx} className="mb-6 px-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">
                {group.group}
              </h2>
              <div className="space-y-1">
                {group.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      activeTab === item.id 
                        ? 'bg-[#0284C7]/10 text-[#0284C7]' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#0284C7]' : 'text-gray-400'}`} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full md:w-[calc(100%-18rem)]">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
    </>
  );
}
