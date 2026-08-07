content = open('src/pages/public/Home.tsx').read()
content = content.replace("const SuspenseWrapper = ({ children }: { children: React.ReactNode }) =>", "const SuspenseWrapper = ({ children }: { children: React.ReactNode; key?: React.Key }) =>")
open('src/pages/public/Home.tsx', 'w').write(content)
