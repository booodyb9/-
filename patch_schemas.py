import re

with open('src/components/SEO.tsx', 'r') as f:
    content = f.read()

# Change script tag logic:
script_logic = """
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            ...(defaultStructuredData["@graph"] as any[]),
            ...(structuredData ? (Array.isArray(structuredData) ? structuredData : [structuredData]) : [])
          ]
        })}
      </script>
"""

content = re.sub(r'<script type="application/ld\+json">.*?</script>', script_logic, content, flags=re.DOTALL)

with open('src/components/SEO.tsx', 'w') as f:
    f.write(content)

