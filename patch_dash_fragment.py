content = open('src/pages/dashboard/DashboardLayout.tsx').read()
content = content.replace("<Helmet><meta name=\"robots\" content=\"noindex, nofollow\" /></Helmet>\n    <div className=\"min-h-screen", "<>\n    <Helmet><meta name=\"robots\" content=\"noindex, nofollow\" /></Helmet>\n    <div className=\"min-h-screen")
content = content.replace("    </div>\n  );\n}\n", "    </div>\n    </>\n  );\n}\n")
open('src/pages/dashboard/DashboardLayout.tsx', 'w').write(content)
