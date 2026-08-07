content = open('src/pages/dashboard/ArrayEditor.tsx').read()
content = content.replace("type: 'text' | 'textarea' | 'image' | 'number';", "type: 'text' | 'textarea' | 'image' | 'number' | 'boolean';")
# handle boolean in schema.map
boolean_handler = """
                ) : field.type === 'boolean' ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={!!item[field.key]} 
                      onChange={e => updateItem(index, field.key, e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-[#0284C7] focus:ring-[#0284C7]"
                    />
                    <span className="text-gray-700 font-bold">{field.label}</span>
                  </label>
                ) : (
"""
content = content.replace(") : (\n                  <input", boolean_handler + "                  <input")
open('src/pages/dashboard/ArrayEditor.tsx', 'w').write(content)
