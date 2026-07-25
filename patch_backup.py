import re

with open('src/pages/dashboard/DriveBackup.tsx', 'r') as f:
    content = f.read()

content = content.replace("!accessToken ?", "false ?")
content = content.replace("disabled={isBackingUp || !accessToken}", "disabled={isBackingUp}")
content = content.replace("نسخة احتياطية على Google Drive", "نسخة احتياطية للبيانات")
content = content.replace("على حساب Google Drive الخاص بك", "على جهازك")

with open('src/pages/dashboard/DriveBackup.tsx', 'w') as f:
    f.write(content)
