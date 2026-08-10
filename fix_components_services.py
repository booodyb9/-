import re

with open('src/components/Services.tsx', 'r') as f:
    content = f.read()

# I will just replace the images using regex based on titles to be safe
replacements = {
    "واجهات زجاجية واستركشر": "https://ugvdoabczcnxluzxehga.supabase.co/storage/v1/object/public/media/516d5831-d7a5-4cf4-aee2-83774df3f590.jpg",
    "قواطع زجاجية مكتبية": "https://ugvdoabczcnxluzxehga.supabase.co/storage/v1/object/public/media/47c05967-1abd-4b26-900a-f0c97e88ce2b.jpg",
    "كبائن شاور": "https://ugvdoabczcnxluzxehga.supabase.co/storage/v1/object/public/media/portfolio/covers/4f1aa8fe-6836-431f-92a6-00c06985a988.webp",
    "واجهات وأبواب سيكوريت": "https://ugvdoabczcnxluzxehga.supabase.co/storage/v1/object/public/media/e9fd27f9-f786-474c-af76-2021bc8db88d.png",
}

for title, new_img in replacements.items():
    # Find the block for this title
    pattern = r"(title:\s*'" + title + r"',\s*description:\s*'[^']+',\s*image:\s*)'[^']+'"
    content = re.sub(pattern, r"\1'" + new_img + "'", content)

with open('src/components/Services.tsx', 'w') as f:
    f.write(content)
print("Updated images in Services.tsx")
