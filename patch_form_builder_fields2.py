import re

with open('src/pages/dashboard/FormBuilder.tsx', 'r') as f:
    content = f.read()

content = content.replace('editingForm.fields', '(editingForm.fields || [])')
content = content.replace('((editingForm.fields || []) || [])', '(editingForm.fields || [])') # in case of double replacement

with open('src/pages/dashboard/FormBuilder.tsx', 'w') as f:
    f.write(content)
