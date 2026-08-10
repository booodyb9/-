import re

with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

old_iframe = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3625.7!2d46.6753!3d24.7136!1m3!1d3625.7!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsKwNDAnMzEuMSJF!5e0!3m2!1sar!2ssa!4v1700000000000" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="موقع زجاج الرياض"></iframe>'
new_iframe = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463877.31244093843!2d46.93246736569614!3d24.725455364177265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1714152542566!5m2!1sen!2s" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="موقع زجاج الرياض"></iframe>'

if old_iframe in content:
    content = content.replace(old_iframe, new_iframe)
    with open('src/pages/public/Home.tsx', 'w') as f:
        f.write(content)
    print("Fixed Home map")
else:
    print("Could not find old_iframe in Home.tsx")
