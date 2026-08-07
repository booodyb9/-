import {
  LayoutDashboard,
  FileText,
  Image,
  Briefcase,
  Settings,
  Users,
  Activity,
  HardDrive,
  MessageSquare,
  Star,
  HelpCircle,
  Navigation,
  Search,
  Share2,
  FolderOpen,
} from 'lucide-react';

export const dashboardMenu = [
  {
    group: 'الرئيسية',
    items: [
      { id: 'home', label: 'الرئيسية والإحصائيات', icon: LayoutDashboard },
      { id: 'messages', label: 'صندوق الرسائل', icon: MessageSquare },
    ],
  },
  {
    group: 'إدارة المحتوى',
    items: [
      { id: 'pages', label: 'الصفحات الديناميكية', icon: FileText },
      { id: 'services', label: 'الخدمات', icon: Briefcase },
      { id: 'portfolio', label: 'معرض الأعمال والمشاريع', icon: Image },
      { id: 'blog', label: 'المدونة والمقالات', icon: FileText },
      { id: 'testimonials', label: 'آراء العملاء', icon: Star },
      { id: 'faq', label: 'الأسئلة الشائعة', icon: HelpCircle },
      { id: 'partners', label: 'شركاء النجاح', icon: Users },
    ],
  },
  {
    group: 'الوسائط',
    items: [
      { id: 'media', label: 'مكتبة الوسائط', icon: FolderOpen },
      { id: 'bulk_upload', label: 'رفع متعدد', icon: Image },
    ],
  },
  {
    group: 'إعدادات الموقع',
    items: [
      { id: 'navigation', label: 'القوائم والروابط', icon: Navigation },
      { id: 'seo', label: 'إعدادات SEO', icon: Search },
      { id: 'performance', label: 'فحص الأداء والسرعة', icon: Activity },
      { id: 'social', label: 'روابط التواصل', icon: Share2 },
      { id: 'settings', label: 'الإعدادات العامة', icon: Settings },
      { id: 'backup', label: 'نسخة احتياطية', icon: HardDrive },
    ],
  },
] as const;
