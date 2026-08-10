import re
with open('src/pages/dashboard/PortfolioManager.tsx', 'r') as f:
    content = f.read()

target = "fetchContents();"
replacement = "fetchContents();\n      setSuccessMessage('تم الحفظ بنجاح');\n      setTimeout(() => setSuccessMessage(null), 3000);"

content = content.replace(target, replacement)

with open('src/pages/dashboard/PortfolioManager.tsx', 'w') as f:
    f.write(content)
print("Portfolio success message patched")
