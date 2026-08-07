with open('src/pages/dashboard/ArrayEditor.tsx', 'r') as f:
    content = f.read()

# Import ReactQuill
if 'import ReactQuill' not in content:
    content = content.replace("import { ChevronUp, ChevronDown, Trash2, Upload, GripVertical } from 'lucide-react';",
                              "import { ChevronUp, ChevronDown, Trash2, Upload, GripVertical } from 'lucide-react';\nimport ReactQuill from 'react-quill';\nimport 'react-quill/dist/quill.snow.css';")

# Add modules
if 'const modules =' not in content:
    modules = """
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'clean']
  ],
};
"""
    content = content.replace('export default function ArrayEditor({ value, onChange, schema }: Props) {', modules + '\nexport default function ArrayEditor({ value, onChange, schema }: Props) {')

# Add rich_text to rendering
rich_text_target = "} : field.type === 'image' ?"
rich_text_replacement = "} : field.type === 'rich_text' ? (\n                  <div className=\"bg-white\" dir=\"ltr\">\n                    <ReactQuill \n                      theme=\"snow\" \n                      value={item[field.key] || ''} \n                      onChange={(val) => updateItem(index, field.key, val)} \n                      modules={modules} \n                      className=\"h-64 mb-12\" \n                    />\n                  </div>\n                ) : field.type === 'image' ?"

content = content.replace(rich_text_target, rich_text_replacement)

with open('src/pages/dashboard/ArrayEditor.tsx', 'w') as f:
    f.write(content)
print("ArrayEditor patched")
