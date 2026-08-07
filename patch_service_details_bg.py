with open('src/pages/public/ServiceDetails.tsx', 'r') as f:
    content = f.read()

# First revert the broken tags
broken_fallback = """      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-12 px-4 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold mb-4">جاري التحميل أو الخدمة غير موجودة</div>
          <Link to="/services" className="text-[#0284C7] hover:underline font-bold">العودة للخدمات</Link>
        </div>
      </main>
      <Footer />
    </>"""
fixed_fallback = """      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-12 px-4 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold mb-4">جاري التحميل أو الخدمة غير موجودة</div>
          <Link to="/services" className="text-[#0284C7] hover:underline font-bold">العودة للخدمات</Link>
        </main>
        <Footer />
      </>"""

content = content.replace(broken_fallback, fixed_fallback)

with open('src/pages/public/ServiceDetails.tsx', 'w') as f:
    f.write(content)
print("Reverted fallback")
