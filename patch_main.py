import re
with open('src/main.tsx', 'r') as f:
    content = f.read()

content = content.replace("import App from './App.tsx';", "import App from './App.tsx';\nimport GlobalErrorBoundary from './components/GlobalErrorBoundary';")
content = content.replace("<App />", "<GlobalErrorBoundary><App /></GlobalErrorBoundary>")

with open('src/main.tsx', 'w') as f:
    f.write(content)
