import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function ProjectStats() {
  const { language } = useLanguage();

  const timelineDataAr = [
    { name: 'واجهات', days: 14 },
    { name: 'قواطع مكتبية', days: 7 },
    { name: 'كبائن شاور', days: 3 },
    { name: 'درابزين زجاجي', days: 5 },
    { name: 'مرايا', days: 2 },
  ];

  const timelineDataEn = [
    { name: 'Facades', days: 14 },
    { name: 'Partitions', days: 7 },
    { name: 'Shower Cabins', days: 3 },
    { name: 'Glass Handrails', days: 5 },
    { name: 'Mirrors', days: 2 },
  ];

  const efficiencyDataAr = [
    { year: '2020', efficiency: 85, savings: 10 },
    { year: '2021', efficiency: 88, savings: 15 },
    { year: '2022', efficiency: 92, savings: 20 },
    { year: '2023', efficiency: 96, savings: 25 },
    { year: '2024', efficiency: 99, savings: 30 },
  ];

  const efficiencyDataEn = [
    { year: '2020', efficiency: 85, savings: 10 },
    { year: '2021', efficiency: 88, savings: 15 },
    { year: '2022', efficiency: 92, savings: 20 },
    { year: '2023', efficiency: 96, savings: 25 },
    { year: '2024', efficiency: 99, savings: 30 },
  ];

  const timelineData = language === 'ar' ? timelineDataAr : timelineDataEn;
  const efficiencyData = language === 'ar' ? efficiencyDataAr : efficiencyDataEn;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-[#0284C7] text-sm font-bold tracking-widest uppercase mb-3">
            {language === 'ar' ? 'إحصائيات وكفاءة' : 'Stats & Efficiency'}
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] leading-tight mb-4">
            {language === 'ar' ? 'أداء مثبت وتوفير مستدام' : 'Proven Performance & Sustainable Savings'}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {language === 'ar'
              ? 'نلتزم بتقديم أسرع أوقات للتنفيذ مع أعلى معايير الكفاءة في استخدام المواد وتقليل الهدر، مما يضمن لك توفيراً في الوقت والتكلفة.'
              : 'We commit to providing the fastest execution times with the highest standards of material efficiency and waste reduction, ensuring you save time and money.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Timeline Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50 p-6 rounded-sm border border-gray-100"
          >
            <h4 className="text-xl font-bold text-[#0F172A] mb-6 text-center">
              {language === 'ar' ? 'متوسط وقت تنفيذ المشاريع (بالأيام)' : 'Average Project Timeline (Days)'}
            </h4>
            <div className="h-80 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timelineData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '4px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="days" fill="#0284C7" radius={[4, 4, 0, 0]} barSize={40} name={language === 'ar' ? 'أيام التنفيذ' : 'Execution Days'} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Efficiency Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50 p-6 rounded-sm border border-gray-100"
          >
            <h4 className="text-xl font-bold text-[#0F172A] mb-6 text-center">
              {language === 'ar' ? 'تطور كفاءة استخدام المواد والتوفير (%)' : 'Material Efficiency & Savings Progress (%)'}
            </h4>
            <div className="h-80 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={efficiencyData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284C7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0284C7" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '4px', color: '#fff' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#0284C7" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorEfficiency)" 
                    name={language === 'ar' ? 'كفاءة المواد' : 'Material Efficiency'} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSavings)" 
                    name={language === 'ar' ? 'توفير التكلفة' : 'Cost Savings'} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
