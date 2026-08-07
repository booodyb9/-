with open('src/components/Contact.tsx', 'r') as f:
    content = f.read()

# It looks like the map is present both at the end of the motion.div and at the end of the form.
# Let's remove the second one.

map_html = """              <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463877.31244093843!2d46.93246736569614!3d24.725455364177265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1714152542566!5m2!1sen!2s"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقع الرياض"
              ></iframe>
            </div>
          </motion.div>"""

content = content.replace(map_html, "          </motion.div>")

with open('src/components/Contact.tsx', 'w') as f:
    f.write(content)
