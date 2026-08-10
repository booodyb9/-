import re

with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

calc_strip_block = """        <div className="calc-strip reveal">
          <div className="calc-strip-text">
            <div className="calc-strip-title">احسب تكلفة مشروعك الآن 🧮</div>
            <div className="calc-strip-desc">أدخل المساحة ونوع الزجاج — واحصل على تقدير فوري لميزانيتك</div>
          </div>
          <button className="btn btn-light" onClick={() => setIsCalcOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            جرّب الحاسبة المجانية
          </button>
        </div>"""

if calc_strip_block in content:
    # Remove it from its current position
    content = content.replace(calc_strip_block, "")
    
    # Place it above <section id="services">
    target_pos = """      <section id="services">"""
    
    new_pos = calc_strip_block + "\n\n      <section id=\"services\">"
    
    content = content.replace(target_pos, new_pos)
    
    with open('src/pages/public/Home.tsx', 'w') as f:
        f.write(content)
    print("Moved calc-strip above services")
else:
    print("Could not find calc-strip_block")

