import re

with open('src/pages/dashboard/FormBuilder.tsx', 'r') as f:
    content = f.read()

content = content.replace('value={editingForm.title}', "value={editingForm.title || ''}")
content = content.replace('value={field.label}', "value={field.label || ''}")
content = content.replace('value={field.type}', "value={field.type || 'text'}")

with open('src/pages/dashboard/FormBuilder.tsx', 'w') as f:
    f.write(content)
