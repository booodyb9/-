import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useContent } from '../../contexts/ContentContext';
import { Calendar, User, Clock, RefreshCw } from 'lucide-react';


const defaultBlogPosts = [
  {
    category: 'دليل تقني',
    title: 'دليلك الشامل لاختيار الزجاج المناسب لكبائن الشاور',
    excerpt: 'تعرف على الفرق بين زجاج السيكوريت والزجاج العادي، وأهمية السماكة المناسبة لضمان الأمان والاناقة في حمامك.',
    date: '2024-05-15',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: '<p>اختيار الزجاج المناسب لكابينة الشاور يعتبر خطوة هامة في تصميم الحمام. الزجاج السيكوريت بسماكة 10 ملم أو 12 ملم هو الخيار الأمثل لقوته ومتانته.</p><p>يوفر الزجاج الشفاف إحساساً باتساع المكان، بينما يعتبر الزجاج المصنفر (المثلج) الخيار الأفضل للخصوصية.</p>'
  },
  {
    category: 'اتجاهات الصناعة',
    title: 'مستقبل الواجهات الزجاجية الذكية في المعمار الحديث',
    excerpt: 'كيف تساهم التقنيات الحديثة في صناعة زجاج يتحكم بالحرارة والضوء لتقليل استهلاك الطاقة في المباني الكبرى.',
    date: '2024-05-10',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: '<p>تتجه صناعة الزجاج المعماري نحو تقنيات الزجاج الذكي الذي يتغير لونه لتقليل حرارة الشمس الساطعة مما يخفض من استهلاك التكييف والطاقة.</p><p>نحن في زجاج الرياض نواكب أحدث تقنيات الزجاج المزدوج (Double Glass) العازل للحرارة والصوت.</p>'
  },
  {
    category: 'دراسة حالة',
    title: 'تحويل مساحة مكتبية مغلقة إلى بيئة عمل مفتوحة ومشرقة',
    excerpt: 'نستعرض كيف ساهمت قواطع الزجاج المزدوجة في تحسين الإضاءة الطبيعية والإنتاجية في مقر شركة تقنية بالرياض.',
    date: '2024-05-02',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: '<p>الضوء الطبيعي عامل أساسي لرفع إنتاجية الموظفين. باستخدام القواطع الزجاجية المزدوجة مع عزل صوتي عالي، تمكنا من توفير بيئة عمل مفتوحة تحافظ على الخصوصية عند الحاجة.</p>'
  }
];

export default function BlogDetails() {
  const { slug } = useParams();
  const { getContent } = useContent();
  const [post, setPost] = useState<any>(null);

  // Calculate reading time

  const addInternalLinks = (html: string) => {
    let linked = html;
    // Example auto-linking: replace 'زجاج سيكوريت' with a link to services
    const keywords = [
      { word: 'زجاج سيكوريت', link: '/services' },
      { word: 'واجهات زجاجية', link: '/portfolio' },
      { word: 'زجاج الرياض', link: '/' }
    ];
    
    // Only replace outside of HTML tags to avoid breaking existing links/images
    keywords.forEach(kw => {
      const regex = new RegExp(`(?![^<]*>|[^<>]*<\/a>)${kw.word}`, 'g');
      linked = linked.replace(regex, `<a href="${kw.link}" class="text-[#0284C7] hover:underline" title="${kw.word}">${kw.word}</a>`);
    });
    return linked;
  };

  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const noHTML = text.replace(/<[^>]*>?/gm, '');
    const words = noHTML.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return `${time} دقيقة قراءة`;
  };


  useEffect(() => {
    let posts = [];
    const blogContent = getContent('blog_items');
    if (blogContent && blogContent.body) {
      try {
        posts = JSON.parse(blogContent.body);
      } catch (e) {}
    }
    const allPosts = [...posts, ...defaultBlogPosts];
    const found = allPosts.find((p: any) => 
      p.title === decodeURIComponent(slug || '') || 
      p.title.replace(/\s+/g, '-').toLowerCase() === slug
    );
    setPost(found);
  }, [slug, getContent]);


  const articleSchema = post ? {
    "@type": "Article",
    "headline": post.title,
    "image": post.image,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "شركة زجاج الرياض"
    },
    "publisher": {
      "@type": "Organization",
      "name": "شركة زجاج الرياض",
      "logo": {
        "@type": "ImageObject",
        "url": "https://riyadh-glass.ai.studio/og-image.jpg"
      }
    },
    "description": post.excerpt
  } : undefined;

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-12 px-4 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold mb-4">جاري التحميل أو المقال غير موجود</div>
          <Link to="/blog" className="text-[#0284C7] hover:underline font-bold">العودة للمدونة</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
            
      <SEO 
        title={post.seoTitle || `${post.title} | المدونة | شركة زجاج الرياض`} 
        description={post.seoDescription || post.excerpt}
        keywords={post.seoKeywords}
        canonical={post.seoCanonical}
        image={post.seoImage || post.image}
        noindex={post.seoNoIndex}
        structuredData={{

          "@type": "BlogPosting",
          "headline": post.title,
          "image": post.image,
          "author": {
            "@type": "Organization",
            "name": "شركة زجاج الرياض"
          },
          "publisher": {
            "@type": "Organization",
            "name": "شركة زجاج الرياض",
            "logo": {
              "@type": "ImageObject",
              "url": "https://riyadh-glass.ai.studio/og-image.jpg"
            }
          },
          "datePublished": post.date,
          "description": post.excerpt
        }}
      />
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4 max-w-4xl mx-auto">
        <article className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {post.image && (
            <div className="h-[400px] w-full overflow-hidden">
              <img loading="lazy" decoding="async" src={post.image} alt={post.title || 'صورة'} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-8 md:p-12">

            <div className="flex flex-wrap gap-4 items-center text-sm text-gray-500 mb-6">
              {post.category && (
                <span className="bg-[#0284C7]/10 text-[#0284C7] px-3 py-1 rounded-full font-bold">
                  {post.category}
                </span>
              )}
              {post.date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  تاريخ النشر: {post.date}
                </span>
              )}
              {post.lastModified && (
                <span className="flex items-center gap-1 text-gray-400">
                  <RefreshCw className="w-4 h-4" />
                  آخر تحديث: {post.lastModified}
                </span>
              )}
              {post.excerpt && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {getReadingTime(post.excerpt)}
                </span>
              )}
            </div>

            
            <h1 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">{post.title}</h1>
            
            <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: addInternalLinks(post.content || post.excerpt || "") }} />
            
            <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
              <div className="flex gap-4">
                <a href={`https://twitter.com/intent/tweet?text=${post.title}&url=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0284C7]">
                  مشاركة على X
                </a>
              </div>
              <Link to="/blog" className="text-[#0284C7] hover:underline font-bold">
                العودة للمدونة &larr;
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
