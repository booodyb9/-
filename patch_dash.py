content = open('src/pages/dashboard/DashboardLayout.tsx').read()
content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { Helmet } from 'react-helmet-async';")
content = content.replace("<div className=\"min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans\" dir=\"rtl\">", "<Helmet><meta name=\"robots\" content=\"noindex, nofollow\" /></Helmet>\n    <div className=\"min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans\" dir=\"rtl\">")
open('src/pages/dashboard/DashboardLayout.tsx', 'w').write(content)
