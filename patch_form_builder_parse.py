import re

with open('src/pages/dashboard/FormBuilder.tsx', 'r') as f:
    content = f.read()

safe_parse = """    if (formsContent && formsContent.body) {
      try {
        const parsed = JSON.parse(formsContent.body);
        if (Array.isArray(parsed)) {
          setForms(parsed);
        } else {
          setForms([]);
        }
      } catch (e) {
        console.error('Failed to parse forms content', e);
      }"""

content = re.sub(r'    if \(formsContent && formsContent\.body\) \{\s*try \{\s*setForms\(JSON\.parse\(formsContent\.body\)\);\s*\} catch \(e\) \{\s*console\.error\(\'Failed to parse forms content\', e\);\s*\}\s*\}', safe_parse, content)

with open('src/pages/dashboard/FormBuilder.tsx', 'w') as f:
    f.write(content)
