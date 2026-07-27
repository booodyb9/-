import re

with open('src/components/ErrorBoundary.tsx', 'r') as f:
    content = f.read()

content = content.replace("extends Component<Props, State>", "extends React.Component<Props, State>")

with open('src/components/ErrorBoundary.tsx', 'w') as f:
    f.write(content)
