import re

with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

# Replace the broken part
old_broken = """      <Footer />
      </div>
          <div className="calc-modal-body">"""

new_fixed = """      <Footer />
      <div className={`calc-modal ${isCalcOpen ? 'active' : ''}`}>
        <div className="calc-modal-content">
          <div className="calc-modal-header">
            <h3 className="calc-modal-title">احسب تكلفة مشروعك التقريبية</h3>
            <button className="calc-modal-close" onClick={() => setIsCalcOpen(false)}>×</button>
          </div>
          <div className="calc-modal-body">"""

content = content.replace(old_broken, new_fixed)

with open('src/pages/public/Home.tsx', 'w') as f:
    f.write(content)
