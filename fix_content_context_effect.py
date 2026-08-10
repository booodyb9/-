import re

with open('src/contexts/ContentContext.tsx', 'r') as f:
    content = f.read()

effect = """  useEffect(() => {
    fetchContents();
    fetchMedia();
    const channel = supabase
      .channel('contents_changes_ctx')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contents' },
        (payload) => {
          fetchContents();
        }
      )
      .subscribe();

    const mediaChannel = supabase
      .channel('media_changes_ctx')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'media' },
        (payload) => {
          fetchMedia();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(mediaChannel);
    };
  }, []);"""

content = re.sub(r'  useEffect\(\(\) => \{.*?  \}, \[\]\);', effect, content, flags=re.DOTALL)

with open('src/contexts/ContentContext.tsx', 'w') as f:
    f.write(content)
