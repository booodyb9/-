import { useState, useEffect, useCallback } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import DashboardLayout from './dashboard/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { useContent } from '../contexts/ContentContext';
import Messages from './dashboard/Messages';
import MediaLibrary from './dashboard/MediaLibrary';
import DriveBackup from './dashboard/DriveBackup';
import PerformanceTool from './dashboard/PerformanceTool';
import ContentManager from './dashboard/ContentManager';
import PagesManager from './dashboard/PagesManager';
import DashboardHome from './dashboard/DashboardHome';
import FormBuilder from './dashboard/FormBuilder';
import HomepageBuilder from './dashboard/HomepageBuilder';
import BulkGalleryUpload from './dashboard/BulkGalleryUpload';
import PortfolioManager from './dashboard/PortfolioManager';
import SiteSettings from './dashboard/SiteSettings';
import type { Message } from './dashboard/types';
import { supabase } from '../lib/supabase';

type DashboardTab =
  | 'home'
  | 'messages'
  | 'content'
  | 'pages'
  | 'drive'
  | 'media'
  | 'bulk_upload'
  | 'forms'
  | 'settings'
  | 'services'
  | 'portfolio'
  | 'blog'
  | 'testimonials'
  | 'faq'
  | 'partners'
  | 'homepage_builder'
  | 'navigation'
  | 'seo'
  | 'social'
  | 'users'
  | 'roles'
  | 'activity'
  | 'backup'
  | 'performance';

export default function Dashboard() {
  const { user, loading, signInWithEmail, logout, token, isAdmin } = useAuth();
  const { contents, loading: contentsLoading, refreshContent: fetchContents, mediaFiles, fetchMedia } = useContent();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('home');
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const { error } = await signInWithEmail(email.trim(), password);
    if (error) {
      setAuthError(error.message || 'حدث خطأ في المصادقة');
    }
  };

  const fetchMessages = useCallback(async () => {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id,name,phone,service,message,created_at,is_read')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setMessages((data ?? []) as Message[]);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (!user || !isAdmin) return;

    void fetchMessages();
    const messagesChannel = supabase
      .channel(`messages_changes_${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        void fetchMessages();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(messagesChannel);
    };
  }, [user, isAdmin, fetchMessages]);

  const backupToDrive = useCallback(async () => {
    setIsBackingUp(true);
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        messages,
        contents,
        mediaFiles,
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      alert('تم تحميل النسخة الاحتياطية بنجاح!');
    } catch (error) {
      console.error('Error backing up:', error);
      alert('حدث خطأ أثناء النسخ الاحتياطي');
    } finally {
      setIsBackingUp(false);
    }
  }, [messages, contents, mediaFiles]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" dir="rtl">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">لوحة التحكم</h2>
          <form onSubmit={handleAuth} className="space-y-4">
            <p className="text-gray-600 mb-8">سجل الدخول بحساب المسؤول للوصول إلى لوحة التحكم.</p>
            {authError && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{authError}</div>}
            <input
              type="email"
              autoComplete="username"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-right"
              required
            />
            <input
              type="password"
              autoComplete="current-password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-right"
              required
            />
            <button type="submit" className="w-full bg-[#0284C7] text-white py-3 px-4 rounded-md hover:bg-[#0369A1] transition-colors font-bold mt-4">
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" dir="rtl">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <p className="text-red-600 mb-8 font-bold">هذا الحساب لا يملك صلاحية مسؤول.</p>
          <button onClick={() => void logout()} className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-bold">
            تسجيل الخروج
          </button>
        </div>
      </div>
    );
  }

  if (contentsLoading) {
    return (
      <DashboardLayout activeTab={activeTab} setActiveTab={(tab) => setActiveTab(tab as DashboardTab)}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-12 h-12 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={(tab) => setActiveTab(tab as DashboardTab)}>
      {activeTab === 'home' && <ErrorBoundary><DashboardHome messages={messages} contents={contents} mediaFiles={mediaFiles} /></ErrorBoundary>}
      {activeTab === 'messages' && <ErrorBoundary><Messages messages={messages} loading={loadingMessages} /></ErrorBoundary>}
      {activeTab === 'media' && <ErrorBoundary><MediaLibrary mediaFiles={mediaFiles} fetchMedia={fetchMedia} /></ErrorBoundary>}
      {activeTab === 'bulk_upload' && <ErrorBoundary><BulkGalleryUpload token={token} contents={contents} fetchContents={fetchContents} fetchMedia={fetchMedia} /></ErrorBoundary>}
      {activeTab === 'backup' && <ErrorBoundary><DriveBackup isBackingUp={isBackingUp} accessToken={token} backupToDrive={backupToDrive} /></ErrorBoundary>}
      {activeTab === 'pages' && <ErrorBoundary><PagesManager pages={contents.filter((c) => c.type === 'page')} fetchContents={fetchContents} /></ErrorBoundary>}
      {activeTab === 'services' && <ErrorBoundary><ContentManager contents={contents} fetchContents={fetchContents} token={token} filterKeys={['services_intro', 'services_items']} /></ErrorBoundary>}
      {activeTab === 'portfolio' && <ErrorBoundary><PortfolioManager contents={contents} fetchContents={fetchContents} token={token} /></ErrorBoundary>}
      {activeTab === 'blog' && <ErrorBoundary><ContentManager contents={contents} fetchContents={fetchContents} token={token} filterKeys={['blog_intro', 'blog_items']} /></ErrorBoundary>}
      {activeTab === 'testimonials' && <ErrorBoundary><ContentManager contents={contents} fetchContents={fetchContents} token={token} filterKeys={['testimonials_items']} /></ErrorBoundary>}
      {activeTab === 'faq' && <ErrorBoundary><ContentManager contents={contents} fetchContents={fetchContents} token={token} filterKeys={['faq_items']} /></ErrorBoundary>}
      {activeTab === 'partners' && <ErrorBoundary><ContentManager contents={contents} fetchContents={fetchContents} token={token} filterKeys={['trusted_partners']} /></ErrorBoundary>}
      {activeTab === 'homepage_builder' && <ErrorBoundary><HomepageBuilder /></ErrorBoundary>}
      {activeTab === 'navigation' && <ErrorBoundary><ContentManager contents={contents} fetchContents={fetchContents} token={token} filterKeys={['navigation_links']} /></ErrorBoundary>}
      {activeTab === 'forms' && <ErrorBoundary><FormBuilder /></ErrorBoundary>}
      {activeTab === 'seo' && <ErrorBoundary><ContentManager contents={contents} fetchContents={fetchContents} token={token} filterKeys={['seo_settings']} /></ErrorBoundary>}
      {activeTab === 'social' && <ErrorBoundary><ContentManager contents={contents} fetchContents={fetchContents} token={token} filterKeys={['social_links']} /></ErrorBoundary>}
      {activeTab === 'settings' && <ErrorBoundary><SiteSettings contents={contents} fetchContents={fetchContents} /></ErrorBoundary>}
      {activeTab === 'performance' && <ErrorBoundary><PerformanceTool /></ErrorBoundary>}
      {activeTab === 'content' && <ErrorBoundary><ContentManager contents={contents} fetchContents={fetchContents} token={token} /></ErrorBoundary>}
      {(activeTab === 'users' || activeTab === 'roles' || activeTab === 'activity' || activeTab === 'drive') && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">هذا القسم غير مفعّل بعد.</div>
      )}
    </DashboardLayout>
  );
}
