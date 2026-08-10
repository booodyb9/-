with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

# find `<div className="fab-wrap">` and remove it and everything inside until `</div>` that closes it.
# It's at the bottom just before `</main>` or `</>`.
# Let's just use regex.

import re
# The block looks like:
#      <div className="fab-wrap">
#        <a href="https://wa.me/966510233706" target="_blank" rel="noopener noreferrer" className="fab fab-wa" title="واتساب">
#          ...
#        </a>
#        <button className="fab fab-chat" ...>...</button>
#      </div>

new_content = re.sub(r'<div className="fab-wrap">.*?</div>\s*(?=</main>|</div>|<>|</>)', '', content, flags=re.DOTALL)

with open('src/pages/public/Home.tsx', 'w') as f:
    f.write(new_content)
