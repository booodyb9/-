content = open('src/components/CostCalculator.tsx').read()
content = content.replace("<h4", "<h3").replace("</h4", "</h3")
open('src/components/CostCalculator.tsx', 'w').write(content)
