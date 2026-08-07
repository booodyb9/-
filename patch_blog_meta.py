content = open('src/pages/public/BlogDetails.tsx').read()
content = content.replace("import { Calendar, User } from 'lucide-react';", "import { Calendar, User, Clock, RefreshCw } from 'lucide-react';")

calc_reading_time = """
  // Calculate reading time
  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const noHTML = text.replace(/<[^>]*>?/gm, '');
    const words = noHTML.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return `${time} دقيقة قراءة`;
  };
"""
content = content.replace("  const [post, setPost] = useState<any>(null);", "  const [post, setPost] = useState<any>(null);\n" + calc_reading_time)

meta_html = """
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
"""

content = content.replace("""            <div className="flex gap-4 items-center text-sm text-gray-500 mb-6">
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
            </div>""", meta_html)

open('src/pages/public/BlogDetails.tsx', 'w').write(content)
