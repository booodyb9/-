import { useState, useEffect, useCallback, useMemo } from 'react';
import DashboardLayout from './dashboard/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Edit3, Cloud, Image, Mail, Upload } from 'lucide-react';
import Messages from './dashboard/Messages';
import MediaLibrary from './dashboard/MediaLibrary';
import DriveBackup from './dashboard/DriveBackup';
import ContentManager from './dashboard/ContentManager';
import PagesManager from './dashboard/PagesManager';
import DashboardHome from './dashboard/DashboardHome';
import FormBuilder from './dashboard/FormBuilder';
import HomepageBuilder from './dashboard/HomepageBuilder';
import BulkGalleryUpload from './dashboard/BulkGalleryUpload';
import PortfolioManager from './dashboard/PortfolioManager';
import SiteSettings from './dashboard/SiteSettings';
import { Message, Content, MediaFile } from './dashboard/types';

export default function Dashboard() {
  const { user, loading, signInWithGoogle, logout, token, accessToken, isAdmin } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'messages' | 'content' | 'pages' | 'drive' | 'media' | 'bulk_upload' | 'forms' | 'settings' | 'services' | 'portfolio' | 'blog' | 'testimonials' | 'faq' | 'partners' | 'homepage_builder' | 'navigation' | 'seo' | 'social' | 'users' | 'roles' | 'activity' | 'backup'>('home');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  const fetchMedia = useCallback(async () => {
    try {
      const stored = localStorage.getItem('mock_media');
      setMediaFiles(stored ? JSON.parse(stored) : []);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    setLoadingMessages(true);
    try {
      const stored = localStorage.getItem('mock_messages');
      const data = stored ? JSON.parse(stored) : [];
      setMessages(data.map((m: any) => ({ ...m, createdAt: m.created_at })) as any);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const fetchContents = useCallback(async () => {
    try {
      const stored = localStorage.getItem('mock_contents');
      const data = stored ? JSON.parse(stored) : [];
      setContents(data as any);
    } catch (error) {
      console.error("Failed to fetch contents:", error);
    }
  }, []);

  useEffect(() => {
    if (user && isAdmin) {
      fetchMessages();
      fetchContents();
      fetchMedia();
    }
  }, [user, isAdmin, fetchMessages, fetchContents, fetchMedia]);

  const backupToDrive = useCallback(async () => {
    setIsBackingUp(true);
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        messages,
        contents,
        mediaFiles
      };
      
      const fileContent = JSON.stringify(backupData, null, 2);
      console.log('Mock Backup Content:', fileContent);
      
      setTimeout(() => {
        alert('تم إنشاء النسخة الاحتياطية الوهمية بنجاح!');
        setIsBackingUp(false);
      }, 1000);
    } catch (error) {
      console.error('Error backing up:', error);
      alert('حدث خطأ أثناء النسخ الاحتياطي');
      setIsBackingUp(false);
    }
  }, [messages, contents, mediaFiles]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">لوحة التحكم</h2>
          {!user ? (
            <>
              <p className="text-gray-600 mb-8">الرجاء تسجيل الدخول للوصول إلى لوحة التحكم</p>
              <button 
                onClick={signInWithGoogle}
                className="w-full bg-[#0284C7] text-white py-3 px-4 rounded-md hover:bg-[#0369A1] transition-colors font-bold"
              >
                تسجيل الدخول باستخدام حساب Google
              </button>
            </>
          ) : (
            <>
              <p className="text-red-600 mb-8 font-bold">ليس لديك صلاحية الدخول كمسؤول</p>
              <button 
                onClick={logout}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-bold"
              >
                تسجيل الخروج
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab as any}>
      {activeTab === 'home' && <DashboardHome />}
      {activeTab === 'messages' && <Messages messages={messages} loading={loadingMessages} />}
      {activeTab === 'media' && <MediaLibrary mediaFiles={mediaFiles} fetchMedia={fetchMedia} />}
      {activeTab === 'bulk_upload' && <BulkGalleryUpload token={token as any} contents={contents} fetchContents={fetchContents} fetchMedia={fetchMedia as any} />}
      {activeTab === 'drive' && <DriveBackup isBackingUp={isBackingUp} accessToken={accessToken as any} backupToDrive={backupToDrive} />}
      {activeTab === 'pages' && <PagesManager pages={contents.filter(c => c.type === 'page')} fetchContents={fetchContents} />}
      
      {/* Specific Content Managers */}
      {activeTab === 'services' && <ContentManager contents={contents} fetchContents={fetchContents} token={token as any} filterKeys={['services_intro', 'services_items']} />}
      {activeTab === 'portfolio' && <PortfolioManager contents={contents} fetchContents={fetchContents} token={token as any} />}
      {activeTab === 'blog' && <ContentManager contents={contents} fetchContents={fetchContents} token={token as any} filterKeys={['blog_intro', 'blog_items']} />}
      {activeTab === 'testimonials' && <ContentManager contents={contents} fetchContents={fetchContents} token={token as any} filterKeys={['testimonials_items']} />}
      {activeTab === 'faq' && <ContentManager contents={contents} fetchContents={fetchContents} token={token as any} filterKeys={['faq_items']} />}
      {activeTab === 'partners' && <ContentManager contents={contents} fetchContents={fetchContents} token={token as any} filterKeys={['trusted_partners']} />}
      
      {/* Other sections that aren't specifically mapped yet will just map to full ContentManager or a placeholder */}
      {activeTab === 'homepage_builder' && <HomepageBuilder />}
      {activeTab === 'navigation' && <ContentManager contents={contents} fetchContents={fetchContents} token={token as any} filterKeys={['navigation_links']} />}
      {activeTab === 'forms' && <FormBuilder />}
      {activeTab === 'seo' && <ContentManager contents={contents} fetchContents={fetchContents} token={token as any} filterKeys={['seo_settings']} />}
      {activeTab === 'social' && <ContentManager contents={contents} fetchContents={fetchContents} token={token as any} filterKeys={['social_links']} />}
      {activeTab === 'settings' && <SiteSettings contents={contents} fetchContents={fetchContents} />}
      
      {/* Fallback */}
      {activeTab === 'content' && <ContentManager contents={contents} fetchContents={fetchContents} token={token as any} />}
    </DashboardLayout>
  );
}
