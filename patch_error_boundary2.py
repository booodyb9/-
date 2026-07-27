import re

with open('src/components/ErrorBoundary.tsx', 'r') as f:
    content = f.read()

content = content.replace("import React, { Component, ErrorInfo, ReactNode } from 'react';", "import React, { ErrorInfo, ReactNode } from 'react';")

with open('src/components/ErrorBoundary.tsx', 'w') as f:
    f.write(content)
