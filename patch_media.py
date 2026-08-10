import re

def patch_bulk():
    with open('src/pages/dashboard/BulkGalleryUpload.tsx', 'r') as f:
        content = f.read()

    # Add compression
    content = content.replace(
        "const fileExt = file.name.split('.').pop();",
        """const options = { maxWidthOrHeight: 1920, useWebWorker: false };
        const compressedFile = await imageCompression(file, options);
        const fileExt = file.name.split('.').pop();"""
    )
    content = content.replace(
        ".upload(filePath, file);",
        ".upload(filePath, compressedFile);"
    )
    
    # Fix media insert
    old_insert = """const newImage = { 
          id: uuidv4(),
          name: file.name,
          url: pubData.publicUrl,
          type: 'image',
          size: file.size,
          created_at: new Date().toISOString() 
        };
        
        await supabase.from('media').insert([newImage]);"""
    
    new_insert = """const newImage = { 
          name: file.name,
          url: pubData.publicUrl,
          storage_path: `media/${filePath}`
        };
        
        const { error: insertError } = await supabase.from('media').insert([newImage]);
        if (insertError) console.error("Media insert error:", insertError);"""
        
    content = content.replace(old_insert, new_insert)

    # Call refreshContent
    content = content.replace(
        "fetchMedia();\n      } catch (error)",
        "fetchMedia();\n        refreshContent();\n      } catch (error)"
    )

    with open('src/pages/dashboard/BulkGalleryUpload.tsx', 'w') as f:
        f.write(content)


def patch_array():
    with open('src/pages/dashboard/ArrayEditor.tsx', 'r') as f:
        content = f.read()

    old_insert = """const newImage = { 
         id: uuidv4(),
         name: file.name,
         url: data.publicUrl,
         type: 'image',
        size: compressedFile.size,
        created_at: new Date().toISOString() 
       };
      
      await supabase.from('media').insert([newImage]);"""
      
    new_insert = """const newImage = { 
         name: file.name,
         url: data.publicUrl,
         storage_path: `media/${filePath}`
       };
      
      const { error: insertError } = await supabase.from('media').insert([newImage]);
      if (insertError) console.error("Media insert error:", insertError);"""

    content = content.replace(old_insert, new_insert)
    with open('src/pages/dashboard/ArrayEditor.tsx', 'w') as f:
        f.write(content)

def patch_media():
    with open('src/pages/dashboard/MediaLibrary.tsx', 'r') as f:
        content = f.read()

    old_insert = """return {
          id: uuidv4(),
          name: file.name,
          url: data.publicUrl,
          type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'document',
          size: file.size,
          created_at: new Date().toISOString()
        };"""
        
    new_insert = """return {
          name: file.name,
          url: data.publicUrl,
          storage_path: `media/${filePath}`
        };"""

    content = content.replace(old_insert, new_insert)
    
    # Fix type detection on render
    content = content.replace(
        "m.type === filter",
        "(m.type === filter || (filter === 'image' && m.url && m.url.match(/\\.(jpeg|jpg|gif|png|webp|svg)$/i)) || (filter === 'video' && m.url && m.url.match(/\\.(mp4|webm|ogg)$/i)))"
    )
    
    content = content.replace(
        "file.type === 'image'",
        "file.url && file.url.match(/\\.(jpeg|jpg|gif|png|webp|svg)$/i)"
    )
    
    content = content.replace(
        "file.type === 'video'",
        "file.url && file.url.match(/\\.(mp4|webm|ogg)$/i)"
    )

    with open('src/pages/dashboard/MediaLibrary.tsx', 'w') as f:
        f.write(content)

patch_bulk()
patch_array()
patch_media()
