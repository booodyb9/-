with open('src/pages/public/BlogDetails.tsx', 'r') as f:
    content = f.read()

import re
old_useEffect_regex = re.compile(r'  useEffect\(\(\) => \{.*?  \}, \[slug, getContent\]\);', re.DOTALL)

old_match = old_useEffect_regex.search(content)

if old_match:
    new_useEffect = """  useEffect(() => {
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
      p.title.replace(/\\s+/g, '-').toLowerCase() === slug
    );
    setPost(found);
  }, [slug, getContent]);"""
    
    content = content[:old_match.start()] + new_useEffect + content[old_match.end():]
    with open('src/pages/public/BlogDetails.tsx', 'w') as f:
        f.write(content)
    print("BlogDetails.tsx useEffect fixed manually")
