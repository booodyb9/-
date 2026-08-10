import { FileText, Image, MessageSquare, MailOpen } from 'lucide-react';

export default function DashboardHome({ messages = [], contents = [], mediaFiles = [] }: any) {
  const unreadMessages = messages.filter((message: any) => !message?.is_read).length;
  const recentMessages = messages.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">نظرة عامة على الموقع</h2>
        <div className="text-sm text-gray-500">بيانات مباشرة من قاعدة المحتوى</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="إجمالي الرسائل" value={messages.length} icon={MessageSquare} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="رسائل غير مقروءة" value={unreadMessages} icon={MailOpen} color="text-green-600" bg="bg-green-50" />
        <StatCard title="سجلات المحتوى" value={contents.length} icon={FileText} color="text-purple-600" bg="bg-purple-50" />
        <StatCard title="الوسائط المرفوعة" value={mediaFiles.length} icon={Image} color="text-orange-600" bg="bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">أحدث الرسائل</h3>
          {recentMessages.length === 0 ? (
            <p className="text-gray-500 py-10 text-center">لا توجد رسائل لعرضها.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentMessages.map((message: any) => (
                <div key={message.id} className="py-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-900">{message.name || 'بدون اسم'}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{message.message}</p>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">
                    {message.created_at ? new Date(message.created_at).toLocaleDateString('ar-SA') : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">إحصائيات الزيارات</h3>
          <div className="min-h-56 flex items-center justify-center text-center bg-gray-50 rounded-lg border border-dashed border-gray-200 p-6">
            <div>
              <p className="font-bold text-gray-700 mb-2">لم يتم ربط خدمة تحليلات بعد</p>
              <p className="text-sm text-gray-500">لن تعرض اللوحة أرقام زيارات تقديرية أو وهمية.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className={`w-fit p-3 rounded-lg ${bg} ${color} mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-gray-500 text-sm font-medium mb-1">{title}</h4>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  );
}
