import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const blogs = [
  {
    title: "الزجاج السيكوريت: الأمان والأناقة في المعمار الحديث",
    category: "دليل تقني",
    excerpt: "يُعد الزجاج السيكوريت (Tempered Glass) من أكثر أنواع الزجاج استخدامًا في المباني الحديثة والمشاريع التجارية والسكنية، وذلك بفضل قوته العالية ومقاومته للصدمات.",
    content: "<p>يُعد الزجاج السيكوريت من أكثر أنواع الزجاج أماناً في الاستخدامات المعمارية، حيث يتم معالجته حرارياً ليصبح أقوى بـ 5 مرات من الزجاج العادي.</p><h2>لماذا نستخدم الزجاج السيكوريت؟</h2><ul><li><strong>الأمان:</strong> عند انكساره يتحول إلى قطع صغيرة غير حادة.</li><li><strong>المتانة:</strong> يتحمل الصدمات والضغط بشكل استثنائي.</li><li><strong>الشفافية:</strong> يسمح بمرور الضوء الطبيعي بكفاءة عالية.</li></ul><p>في شركة زجاج الرياض، نستخدم أعلى معايير الجودة في تركيب واجهات السيكوريت وقواطع المكاتب.</p>",
    date: "2024-06-12",
    image: "https://ugvdoabczcnxluzxehga.supabase.co/storage/v1/object/public/media/4890eae4-18db-4e8c-a940-0bb803639c3b.jpg"
  },
  {
    title: "دليلك الشامل لاختيار الزجاج المناسب لكبائن الشاور",
    category: "تصميم داخلي",
    excerpt: "تعرف على الفرق بين زجاج السيكوريت والزجاج العادي، وأهمية السماكة المناسبة لضمان الأمان والأناقة في حمامك.",
    content: "<p>اختيار الزجاج المناسب لكابينة الشاور يعتبر خطوة هامة في تصميم الحمام. الزجاج السيكوريت بسماكة 10 ملم أو 12 ملم هو الخيار الأمثل لقوته ومتانته.</p><p>يوفر الزجاج الشفاف إحساساً باتساع المكان، بينما يعتبر الزجاج المصنفر (المثلج) الخيار الأفضل للخصوصية.</p>",
    date: "2024-05-15",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "مستقبل الواجهات الزجاجية الذكية في المباني الكبرى",
    category: "اتجاهات الصناعة",
    excerpt: "كيف تساهم التقنيات الحديثة في صناعة زجاج يتحكم بالحرارة والضوء لتقليل استهلاك الطاقة في المباني.",
    content: "<p>تتجه صناعة الزجاج المعماري نحو تقنيات الزجاج الذكي الذي يتغير لونه لتقليل حرارة الشمس الساطعة مما يخفض من استهلاك التكييف والطاقة.</p><p>نحن في زجاج الرياض نواكب أحدث تقنيات الزجاج المزدوج (Double Glass) العازل للحرارة والصوت.</p>",
    date: "2024-05-10",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

async function seed() {
  const { error } = await supabase.from('contents').upsert({
    key: 'blog_items',
    title: 'مقالات المدونة',
    type: 'array',
    body: JSON.stringify(blogs)
  }, { onConflict: 'key' });
  
  if (error) console.error("Error saving blogs:", error);
  else console.log("Blogs updated successfully in Supabase!");
}

seed();
