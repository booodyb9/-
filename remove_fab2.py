with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

start_idx = content.find('<div className="fab-wrap">')
if start_idx != -1:
    end_idx = content.find('</div>', start_idx)
    # The fab-wrap has multiple divs inside (Wait, the svg doesn't have div, the chat button has a svg). 
    # Let's just find the exact block since it's around line 570.
    
    # Just split by <div className="fab-wrap"> and take the first part + after </div></div>? No, it's:
    #      <div className="fab-wrap">
    #        <a ...>...</a>
    #        <button ...>...</button>
    #      </div>
    # So `</div>` is the closing tag for `fab-wrap`.
    end_idx = content.find('</div>', content.find('</button>', start_idx)) + 6
    
    new_content = content[:start_idx] + content[end_idx:]
    with open('src/pages/public/Home.tsx', 'w') as f:
        f.write(new_content)
        print("Removed fab-wrap successfully")
else:
    print("fab-wrap not found")
