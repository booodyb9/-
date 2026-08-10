import re

with open('src/components/Services.tsx', 'r') as f:
    content = f.read()

# Remove CostCalculator from the bottom
content = content.replace("        <CostCalculator />\n", "")

# Insert it above the grid
target = """        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24">"""

new_target = """        </motion.div>

        <div className="mb-16">
          <CostCalculator />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24">"""

if target in content:
    content = content.replace(target, new_target)
    with open('src/components/Services.tsx', 'w') as f:
        f.write(content)
    print("Moved CostCalculator up in Services.tsx")
else:
    print("Could not find target in Services.tsx")
