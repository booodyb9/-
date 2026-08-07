content = open('src/pages/dashboard/types.ts').read()
fields = """
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoCanonical?: string;
  seoImage?: string;
  seoNoIndex?: boolean;
"""
content = content.replace("  seoTitle: string;\n  seoDescription: string;", fields)
open('src/pages/dashboard/types.ts', 'w').write(content)
