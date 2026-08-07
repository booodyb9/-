import re

with open('src/pages/public/BlogDetails.tsx', 'r') as f:
    content = f.read()

new_useEffect = """
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
      p.title.replace(/\\s+/g, '-').toLowerCase() === slug
    );
    setPost(found);
  }, [slug, getContent]);
"""

old_useEffect_regex = re.compile(r'  useEffect\(\(\) => \{.*?  \}, \[slug, getContent\]\);', re.DOTALL)
content = old_useEffect_regex.sub(new_useEffect.strip(), content)

with open('src/pages/public/BlogDetails.tsx', 'w') as f:
    f.write(content)

print("BlogDetails.tsx useEffect fixed")
