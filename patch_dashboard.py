import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

new_backup = """
  const backupToDrive = useCallback(async () => {
    setIsBackingUp(true);
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        messages,
        contents,
        mediaFiles
      };
      
      const fileContent = JSON.stringify(backupData, null, 2);
      const blob = new Blob([fileContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('تم تحميل النسخة الاحتياطية بنجاح!');
      setIsBackingUp(false);
    } catch (error) {
      console.error('Error backing up:', error);
      alert('حدث خطأ أثناء النسخ الاحتياطي');
      setIsBackingUp(false);
    }
  }, [messages, contents, mediaFiles]);
"""

content = re.sub(
    r"const backupToDrive = useCallback\(async \(\) => \{.*?\}, \[messages, contents, mediaFiles\]\);",
    new_backup.strip(),
    content, flags=re.DOTALL
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
