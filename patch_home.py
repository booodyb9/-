import re

with open('src/pages/dashboard/DashboardHome.tsx', 'r') as f:
    content = f.read()

new_comp = """
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
"""

content = re.sub(
    r"export default function DashboardHome\(\) \{.*?<div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4\">.*?</div>",
    new_comp.strip(),
    content, flags=re.DOTALL
)

with open('src/pages/dashboard/DashboardHome.tsx', 'w') as f:
    f.write(content)
