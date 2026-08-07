import re

with open('src/pages/dashboard/FormBuilder.tsx', 'r') as f:
    content = f.read()

content = content.replace('editingForm.fields.map(', '(editingForm.fields || []).map(')

with open('src/pages/dashboard/FormBuilder.tsx', 'w') as f:
    f.write(content)
