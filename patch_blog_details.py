with open('src/pages/public/BlogDetails.tsx', 'r') as f:
    content = f.read()

target = 'dangerouslySetInnerHTML={{ __html: addInternalLinks(post.excerpt) }}'
replacement = 'dangerouslySetInnerHTML={{ __html: addInternalLinks(post.content || post.excerpt || "") }}'

if target in content:
    content = content.replace(target, replacement)
    with open('src/pages/public/BlogDetails.tsx', 'w') as f:
        f.write(content)
    print("BlogDetails patched")
else:
    print("BlogDetails target not found")
