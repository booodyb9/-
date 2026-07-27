import re

with open('src/pages/dashboard/BulkGalleryUpload.tsx', 'r') as f:
    content = f.read()

# Fix CATEGORIES
old_cats = """const CATEGORIES = [
  'واجهات زجاجية',
  'قواطع داخلية',
  'أبواب ونوافذ',
  'واجهات معارض',
  'مرايا ديكور',
  'كبائن شاور',
  'درابزين زجاج',
];"""

new_cats = """const CATEGORIES = [
  'واجهات زجاجية (Glass Facades)',
  'أبواب زجاجية (Glass Doors)',
  'كبائن شاور (Shower Cabins)',
  'مرايا (Mirrors)',
  'زجاج مكاتب (Office Glass)',
  'درابزين (Railings)',
  'سكني (Residential)',
  'تجاري (Commercial)',
  'أخرى (Other)'
];"""

content = content.replace(old_cats, new_cats)

# Fix object creation
old_obj = """newGalleryItems.push({
          id: uuidv4(),
          title: file.name.split('.')[0],
          category: selectedCategory,
          description: '',
          image: newImage.url,
          class_name: 'md:col-span-1 md:row-span-1',
          order_index: Date.now()
        });"""

new_obj = """const newId = uuidv4();
        newGalleryItems.push({
          id: newId,
          slug: newId,
          title: file.name.split('.')[0],
          category: selectedCategory,
          description: '',
          location: '',
          serviceType: '',
          client: '',
          completionDate: '',
          materialsUsed: '',
          coverImage: newImage.url,
          galleryImages: [newImage.url],
          isFeatured: false,
          isHidden: false,
          order: Date.now(),
          seoTitle: '',
          seoDescription: ''
        });"""

content = content.replace(old_obj, new_obj)

with open('src/pages/dashboard/BulkGalleryUpload.tsx', 'w') as f:
    f.write(content)
