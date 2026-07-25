import React from 'react';
import { Users, FileText, Image, MessageSquare, Activity, ArrowUpRight, ArrowDownRight, Eye, Edit3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'الأحد', views: 4000, visitors: 2400 },
  { name: 'الإثنين', views: 3000, visitors: 1398 },
  { name: 'الثلاثاء', views: 2000, visitors: 9800 },
  { name: 'الأربعاء', views: 2780, visitors: 3908 },
  { name: 'الخميس', views: 1890, visitors: 4800 },
  { name: 'الجمعة', views: 2390, visitors: 3800 },
  { name: 'السبت', views: 3490, visitors: 4300 },
];

export default function DashboardHome({ messages = [], contents = [], mediaFiles = [] }: any) {
  const unreadMessages = messages.filter((m: any) => !m.is_read).length;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">نظرة عامة على الموقع</h2>
        <div className="text-sm text-gray-500">آخر تحديث: منذ لحظات</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="إجمالي الزيارات" value="-" trend="" isUp={true} icon={Eye} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="رسائل جديدة" value={unreadMessages.toString()} trend="" isUp={true} icon={MessageSquare} color="text-green-600" bg="bg-green-50" />
        <StatCard title="الصفحات النشطة" value={contents.length.toString()} trend="" isUp={true} icon={FileText} color="text-purple-600" bg="bg-purple-50" />
        <StatCard title="الوسائط المرفوعة" value={mediaFiles.length.toString()} trend="" isUp={true} icon={Image} color="text-orange-600" bg="bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">إحصائيات الزوار (أسبوعي)</h3>
          <div className="h-80 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284C7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0284C7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="views" name="المشاهدات" stroke="#0284C7" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">أحدث النشاطات</h3>
          <div className="space-y-4">
            <ActivityItem text="تم نشر مقال جديد 'أفضل أنواع الزجاج'" time="منذ ساعتين" type="publish" />
            <ActivityItem text="رسالة جديدة من 'أحمد محمد'" time="منذ 4 ساعات" type="message" />
            <ActivityItem text="تم رفع 5 صور جديدة لمعرض الأعمال" time="منذ 5 ساعات" type="upload" />
            <ActivityItem text="تحديث إعدادات SEO للصفحة الرئيسية" time="أمس" type="settings" />
            <ActivityItem text="تعديل صفحة 'من نحن'" time="أمس" type="edit" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, isUp, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${bg} ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-bold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
          {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span dir="ltr">{trend}</span>
        </div>
      </div>
      <div>
        <h4 className="text-gray-500 text-sm font-medium mb-1">{title}</h4>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );
}

function ActivityItem({ text, time, type }: any) {
  const getIcon = () => {
    switch (type) {
      case 'publish': return <FileText className="w-4 h-4 text-green-500" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'upload': return <Image className="w-4 h-4 text-purple-500" />;
      case 'settings': return <Activity className="w-4 h-4 text-orange-500" />;
      case 'edit': return <Edit3 className="w-4 h-4 text-gray-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-gray-50 rounded-full shrink-0 border border-gray-100">
        {getIcon()}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">{text}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}
