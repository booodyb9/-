import re

with open('src/components/Hero.tsx', 'r') as f:
    content = f.read()

# Replace img tag in SwiperSlide with logic for eager/lazy loading
old_img = """                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover opacity-50 transform transition-transform duration-[15000ms] ease-linear hover:scale-110"
                />"""

new_img = """                <img
                  src={img.url}
                  alt={img.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="w-full h-full object-cover opacity-50 transform transition-transform duration-[15000ms] ease-linear hover:scale-110"
                />"""

content = content.replace(old_img, new_img)

with open('src/components/Hero.tsx', 'w') as f:
    f.write(content)
