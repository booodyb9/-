import re
with open('src/components/SplashAnimation.tsx', 'r') as f:
    content = f.read()

content = content.replace("const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');", """let hasSeenSplash = false;
    try {
      hasSeenSplash = !!sessionStorage.getItem('hasSeenSplash');
    } catch (e) {}""")

content = content.replace("sessionStorage.setItem('hasSeenSplash', 'true');", """try {
        sessionStorage.setItem('hasSeenSplash', 'true');
      } catch (e) {}""")

with open('src/components/SplashAnimation.tsx', 'w') as f:
    f.write(content)
