import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("const { contents, refreshContent: fetchContents, mediaFiles, fetchMedia, forceRefresh } = useContent();", "const { contents, loading: contentsLoading, refreshContent: fetchContents, mediaFiles, fetchMedia, forceRefresh } = useContent();")

loading_render = """
  if (contentsLoading) {
    return (
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab as any}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-12 h-12 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }
"""
content = content.replace("  return (\n    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab as any}>", loading_render + "\n  return (\n    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab as any}>")

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
