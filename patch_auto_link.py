content = open('src/pages/public/BlogDetails.tsx').read()

auto_link_func = """
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
      const regex = new RegExp(`(?![^<]*>|[^<>]*<\\/a>)${kw.word}`, 'g');
      linked = linked.replace(regex, `<a href="${kw.link}" class="text-[#0284C7] hover:underline" title="${kw.word}">${kw.word}</a>`);
    });
    return linked;
  };
"""

content = content.replace("  const getReadingTime = (text: string) => {", auto_link_func + "\n  const getReadingTime = (text: string) => {")
content = content.replace("dangerouslySetInnerHTML={{ __html: post.excerpt }}", "dangerouslySetInnerHTML={{ __html: addInternalLinks(post.excerpt) }}")

open('src/pages/public/BlogDetails.tsx', 'w').write(content)
