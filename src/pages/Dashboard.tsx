import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Edit3, Cloud, Image, Mail, Upload } from 'lucide-react';
import Messages from './dashboard/Messages';
import MediaLibrary from './dashboard/MediaLibrary';
import DriveBackup from './dashboard/DriveBackup';
import ContentManager from './dashboard/ContentManager';
import BulkGalleryUpload from './dashboard/BulkGalleryUpload';
import { Message, Content, MediaFile } from './dashboard/types';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const { user, loading, signInWithGoogle, logout, token, accessToken, isAdmin } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'content' | 'drive' | 'media' | 'bulk'>('messages');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  const fetchMedia = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('images').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setMediaFiles(data as any);
      }
    } catch (error) {
      console.error("Failed to fetch media:", error);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        // map created_at to createdAt for the component
        setMessages(data.map(m => ({ ...m, createdAt: m.created_at })) as any);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const fetchContents = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('contents').select('*');
      if (!error && data) {
        setContents(data as any);
      }
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
    if (!accessToken) {
      alert("الرجاء تسجيل الدخول مرة أخرى للحصول على صلاحيات Google Drive");
      return;
    }
    setIsBackingUp(true);
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        messages,
        contents,
        mediaFiles
      };
      
      const fileContent = JSON.stringify(backupData, null, 2);
      const metadata = {
        name: `Website_Backup_${new Date().toISOString().split('T')[0]}.json`,
        mimeType: 'application/json',
      };
      
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', new Blob([fileContent], { type: 'application/json' }));
      
      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      });

      if (res.ok) {
        alert('تم إنشاء النسخة الاحتياطية بنجاح على Google Drive!');
      } else {
        const err = await res.text();
        console.error('Backup failed:', err);
        alert('فشل في إنشاء النسخة الاحتياطية. يرجى التأكد من صلاحيات Google Drive.');
      }
    } catch (error) {
      console.error('Error backing up:', error);
      alert('حدث خطأ أثناء النسخ الاحتياطي');
    } finally {
      setIsBackingUp(false);
    }
  }, [accessToken, messages, contents, mediaFiles]);

  const navItems = useMemo(() => [
    { id: 'messages' as const, label: 'الرسائل', icon: Mail },
    { id: 'content' as const, label: 'إدارة المحتوى', icon: Edit3 },
    { id: 'media' as const, label: 'مكتبة الوسائط', icon: Image },
    { id: 'bulk' as const, label: 'رفع متعدد للمشاريع', icon: Upload },
    { id: 'drive' as const, label: 'النسخ الاحتياطي', icon: Cloud },
  ], []);

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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white shadow-md flex flex-col h-auto md:h-screen sticky top-0 z-10">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">لوحة تحكم الموقع</h1>
        </div>
        <nav className="p-4 flex-1 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${
                activeTab === item.id ? 'bg-[#0284C7] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
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

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'messages' && <Messages messages={messages} loading={loadingMessages} />}
          {activeTab === 'media' && <MediaLibrary mediaFiles={mediaFiles} fetchMedia={fetchMedia} token={token} />}
          {activeTab === 'bulk' && <BulkGalleryUpload token={token} contents={contents} fetchContents={fetchContents} fetchMedia={fetchMedia} />}
          {activeTab === 'drive' && <DriveBackup isBackingUp={isBackingUp} accessToken={accessToken} backupToDrive={backupToDrive} />}
          {activeTab === 'content' && <ContentManager contents={contents} fetchContents={fetchContents} token={token} />}
        </div>
      </main>
    </div>
  );
}
