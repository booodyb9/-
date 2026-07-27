import re

with open('src/pages/dashboard/types.ts', 'r') as f:
    content = f.read()

content = content.replace("export interface MediaFile {", "export interface MediaFile {\n  storage_path?: string;")

with open('src/pages/dashboard/types.ts', 'w') as f:
    f.write(content)
