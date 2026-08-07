import re

with open('src/pages/dashboard/BulkGalleryUpload.tsx', 'r') as f:
    content = f.read()

safe_parse = """        let projects = [];
        if (currentContentData && currentContentData.body) {
           try {
             projects = JSON.parse(currentContentData.body);
             if (!Array.isArray(projects)) projects = [];
           } catch (e) {
             console.error("Failed to parse projects in bulk upload", e);
             projects = [];
           }
        }"""

content = re.sub(r'let projects = \[\];\s*if \(currentContentData && currentContentData\.body\) \{\s*projects = JSON\.parse\(currentContentData\.body\);\s*\}', safe_parse, content)

with open('src/pages/dashboard/BulkGalleryUpload.tsx', 'w') as f:
    f.write(content)
