import re

with open('src/components/Services.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '''                <a
                  href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(`مرحباً، أود الاستفسار عن خدمة ${service.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-2 w-full border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white px-4 py-3 text-sm font-bold rounded-sm transition-colors group/btn ripple btn-base"
                >''',
    '''                <div className="mt-auto flex flex-col gap-2">
                  <Link
                    to={`/services/${service.title.replace(/\s+/g, '-').toLowerCase()}`}
                    className="inline-flex items-center justify-center gap-2 w-full border-2 border-[#0284C7] text-[#0284C7] hover:bg-[#0284C7] hover:text-white px-4 py-3 text-sm font-bold rounded-sm transition-colors group/btn ripple btn-base"
                  >
                    تفاصيل الخدمة
                  </Link>
                  <a
                    href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(`مرحباً، أود الاستفسار عن خدمة ${service.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white px-4 py-3 text-sm font-bold rounded-sm transition-colors group/btn ripple btn-base"
                  >'''
)

content = content.replace("</a>\n              </div>\n            </motion.div>", "</a>\n                </div>\n              </div>\n            </motion.div>")

with open('src/components/Services.tsx', 'w') as f:
    f.write(content)
