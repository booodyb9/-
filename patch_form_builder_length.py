import re

with open('src/pages/dashboard/FormBuilder.tsx', 'r') as f:
    content = f.read()

content = content.replace('{form.fields.length}', '{(form.fields || []).length}')

with open('src/pages/dashboard/FormBuilder.tsx', 'w') as f:
    f.write(content)
