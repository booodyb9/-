import re

with open('src/contexts/ContentContext.tsx', 'r') as f:
    content = f.read()

content = content.replace("export function ContentProvider", "export interface MediaFile { id: string; url: string; name: string; created_at: string; storage_path: string; }\n\nexport function ContentProvider")

content = content.replace(
    "interface ContentContextType {",
    "interface ContentContextType {\n  mediaFiles: MediaFile[];\n  fetchMedia: () => Promise<void>;\n  forceRefresh: () => Promise<void>;"
)

content = content.replace(
    "const [contents, setContents] = useState<Content[]>([]);",
    "const [contents, setContents] = useState<Content[]>([]);\n  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);"
)

fetch_media_code = """  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setMediaFiles(data as MediaFile[]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const forceRefresh = async () => {
    await fetchContents();
    await fetchMedia();
  };
"""

content = content.replace(
    "const fetchContents = async () => {",
    fetch_media_code + "\n  const fetchContents = async () => {"
)

content = content.replace(
    "fetchContents();\n    const channel = supabase",
    "fetchContents();\n    fetchMedia();\n    const channel = supabase"
)

content = content.replace(
    ".subscribe();\n    return () => {",
    ".subscribe();\n\n    const mediaChannel = supabase.channel('media_changes_ctx').on('postgres_changes', { event: '*', schema: 'public', table: 'media' }, () => fetchMedia()).subscribe();\n    return () => {\n      supabase.removeChannel(mediaChannel);"
)

content = content.replace(
    "refreshContent: fetchContents, updateContent",
    "refreshContent: fetchContents, updateContent, mediaFiles, fetchMedia, forceRefresh"
)

with open('src/contexts/ContentContext.tsx', 'w') as f:
    f.write(content)
