import re

def patch_bulk():
    with open('src/pages/dashboard/BulkGalleryUpload.tsx', 'r') as f:
        content = f.read()

    # We can use regex to replace it
    pattern = re.compile(r'const newImage = \{.*?await supabase\.from\(\'media\'\)\.insert\(\[newImage\]\);', re.DOTALL)
    
    new_insert = """const newImage = { 
          name: file.name,
          url: pubData.publicUrl,
          storage_path: `media/${filePath}`
        };
        
        const { error: insertError } = await supabase.from('media').insert([newImage]);
        if (insertError) console.error("Media insert error:", insertError);"""
        
    content = pattern.sub(new_insert, content)

    with open('src/pages/dashboard/BulkGalleryUpload.tsx', 'w') as f:
        f.write(content)

def patch_array():
    with open('src/pages/dashboard/ArrayEditor.tsx', 'r') as f:
        content = f.read()

    pattern = re.compile(r'const newImage = \{.*?await supabase\.from\(\'media\'\)\.insert\(\[newImage\]\);', re.DOTALL)
      
    new_insert = """const newImage = { 
         name: file.name,
         url: data.publicUrl,
         storage_path: `media/${filePath}`
       };
      
      const { error: insertError } = await supabase.from('media').insert([newImage]);
      if (insertError) console.error("Media insert error:", insertError);"""

    content = pattern.sub(new_insert, content)
    with open('src/pages/dashboard/ArrayEditor.tsx', 'w') as f:
        f.write(content)

patch_bulk()
patch_array()
