import re

with open('src/components/ChatBubble.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<button onClick={() => setIsOpen(false)}',
    '<button aria-label="إغلاق المحادثة" onClick={() => setIsOpen(false)}'
)
content = content.replace(
    '<button\n                    type="submit"',
    '<button aria-label="إرسال" type="submit"'
)

with open('src/components/ChatBubble.tsx', 'w') as f:
    f.write(content)
