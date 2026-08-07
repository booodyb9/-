with open('src/pages/dashboard/FormBuilder.tsx', 'r') as f:
    content = f.read()

content = content.replace("      } else {\n      setForms([", "      }\n    } else {\n      setForms([")

with open('src/pages/dashboard/FormBuilder.tsx', 'w') as f:
    f.write(content)
