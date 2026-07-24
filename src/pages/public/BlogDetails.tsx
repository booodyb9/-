import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useContent } from '../../contexts/ContentContext';
import { Calendar, User } from 'lucide-react';

export default function BlogDetails() {
  const { slug } = useParams();
  const { getContent } = useContent();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const blogContent = getContent('blog_items');
    if (blogContent && blogContent.body) {
      try {
        const posts = JSON.parse(blogContent.body);
        const found = posts.find((p: any) => 
          p.title === decodeURIComponent(slug || '') || 
          p.title.replace(/\s+/g, '-').toLowerCase() === slug
        );
        setPost(found);
      } catch (e) {}
    }
  }, [slug, getContent]);

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-12 px-4 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">جاري التحميل أو المقال غير موجود</h1>
          <Link to="/blog" className="text-[#0284C7] hover:underline font-bold">العودة للمدونة</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO 
        title={`${post.title} | المدونة | شركة زجاج الرياض`} 
        description={post.excerpt}
      />
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4 max-w-4xl mx-auto">
        <article className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {post.image && (
            <div className="h-[400px] w-full overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-8 md:p-12">
            <div className="flex gap-4 items-center text-sm text-gray-500 mb-6">
              {post.category && (
                <span className="bg-[#0284C7]/10 text-[#0284C7] px-3 py-1 rounded-full font-bold">
                  {post.category}
                </span>
              )}
              {post.date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">{post.title}</h1>
            
            <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
            
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
