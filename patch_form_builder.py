import re

with open('src/pages/dashboard/FormBuilder.tsx', 'r') as f:
    content = f.read()

# Add imports
if 'useContent' not in content:
    content = content.replace(
        "import React, { useState } from 'react';",
        "import React, { useState, useEffect } from 'react';\nimport { useContent } from '../../contexts/ContentContext';\nimport { saveContent } from '../../lib/supabase';"
    )

new_component_start = """
export default function FormBuilder() {
  const { getContent, updateContent, refreshContent } = useContent();
  const formsContent = getContent('custom_forms');
  
  const [forms, setForms] = useState<any[]>([]);
  
  useEffect(() => {
    if (formsContent && formsContent.body) {
      try {
        setForms(JSON.parse(formsContent.body));
      } catch (e) {
        console.error('Failed to parse forms content', e);
      }
    } else {
      setForms([
        { id: '1', title: 'نموذج اتصل بنا الأساسي', fields: [
          { id: 'f1', label: 'الاسم', type: 'text', required: true },
          { id: 'f2', label: 'البريد الإلكتروني', type: 'email', required: true },
          { id: 'f3', label: 'الرسالة', type: 'textarea', required: true }
        ]},
        { id: '2', title: 'طلب عرض سعر', fields: [
          { id: 'f1', label: 'الاسم', type: 'text', required: true },
          { id: 'f2', label: 'رقم الهاتف', type: 'tel', required: true },
          { id: 'f3', label: 'نوع الخدمة', type: 'select', options: ['تركيب زجاج', 'صيانة', 'استشارة'], required: true }
        ]}
      ]);
    }
  }, [formsContent]);

  const saveFormsToDb = async (newForms: any[]) => {
    setForms(newForms);
    const bodyStr = JSON.stringify(newForms);
    updateContent('custom_forms', bodyStr);
    try {
      await saveContent('custom_forms', 'Custom Forms', 'json', bodyStr);
      refreshContent();
    } catch (e) {
      console.error('Failed to save forms', e);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const [editingForm, setEditingForm] = useState<any>(null);
"""

content = re.sub(
    r"export default function FormBuilder\(\) \{.*?const \[editingForm, setEditingForm\] = useState<any>\(null\);",
    new_component_start.strip(),
    content, flags=re.DOTALL
)

# Update form saving
content = content.replace(
    "setForms(forms.map(f => f.id === editingForm.id ? editingForm : f));",
    "saveFormsToDb(forms.map(f => f.id === editingForm.id ? editingForm : f));"
)

content = content.replace(
    "setForms([...forms, newForm]);",
    "saveFormsToDb([...forms, newForm]);"
)

content = content.replace(
    "setForms(forms.filter(f => f.id !== form.id));",
    "saveFormsToDb(forms.filter(f => f.id !== form.id));"
)

with open('src/pages/dashboard/FormBuilder.tsx', 'w') as f:
    f.write(content)
