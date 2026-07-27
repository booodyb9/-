import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("const { contents, loading: contentsLoading, refreshContent: fetchContents } = useContent();", "const { contents, loading: contentsLoading, refreshContent: fetchContents, mediaFiles, fetchMedia, forceRefresh } = useContent();")

# Remove mediaFiles state and fetchMedia callback
content = re.sub(r'const \[mediaFiles, setMediaFiles\] = useState<MediaFile\[\]>\(\[\]\);\s*const fetchMedia = useCallback\(async \(\) => \{.*?\},\s*\[\]\);', '', content, flags=re.DOTALL)

# Remove mediaChannel from Dashboard
content = re.sub(r'const mediaChannel = supabase\s*\.channel\(\'media_changes\'\)\s*\.on\(\'postgres_changes\', \{ event: \'\*\', schema: \'public\', table: \'media\' \}, \(\) => \{\s*fetchMedia\(\);\s*\}\)\s*\.subscribe\(\);', '', content)
content = content.replace('supabase.removeChannel(mediaChannel);', '')
content = content.replace('fetchMedia();', '', 1) # First fetchMedia inside useEffect
content = content.replace('fetchContents, fetchMedia', 'fetchContents')

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
