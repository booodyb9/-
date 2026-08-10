import re

with open('src/pages/public/Home.tsx', 'r') as f:
    content = f.read()

# Add to the hook area
hook_code = """export default function Home() {
  const { getContent } = useContent();
  const portfolioContent = getContent('premium_portfolio_projects');
  const servicesContent = getContent('services_items');
  const testimonialsContent = getContent('testimonials_items');
  const faqContent = getContent('faq_items');
"""

content = content.replace("export default function Home() {\n  const { getContent } = useContent();\n  const portfolioContent = getContent('premium_portfolio_projects');\n  const servicesContent = getContent('services_items');", hook_code)

hook_code_2 = """
  const testimonials = useMemo(() => {
    let parsed = [];
    if (testimonialsContent?.body) {
      try { parsed = JSON.parse(testimonialsContent.body); } catch(e) {}
    }
    if (!parsed || parsed.length === 0) {
      return [
        { text: 'شغل احترافي جداً في تركيب الواجهة الزجاجية للفيلا. التزموا بالوقت المحدد وكانت النتيجة أفضل مما توقعت. المواد المستخدمة فعلاً بجودة عالية.', name: 'م. خالد الدوسري', role: 'صاحب فيلا — الملقا، الرياض', initial: 'خ' },
        { text: 'تعاملنا معهم في تركيب قواطع زجاجية لمقر الشركة الجديد. الفريق متعاون والمقاسات كانت دقيقة بالملي. أنصح بشدة بالتعامل معهم.', name: 'سارة العتيبي', role: 'مديرة مشاريع — شركة تمكين', initial: 'س' },
        { text: 'ركبوا لنا كبائن شاور للحمامات واجهة زجاجية للمسبح. شغل نظيف ومرتب وأسعارهم تنافسية مقارنة بالسوق. شكراً لكم.', name: 'أبو فيصل', role: 'عميل — الياسمين، الرياض', initial: 'ف' }
      ];
    }
    return parsed.filter(t => !t.isHidden).map(t => ({
      text: t.content,
      name: t.name,
      role: t.role,
      initial: t.name ? t.name.charAt(0) : 'ع'
    }));
  }, [testimonialsContent]);

  const faqs = useMemo(() => {
    let parsed = [];
    if (faqContent?.body) {
      try { parsed = JSON.parse(faqContent.body); } catch(e) {}
    }
    if (!parsed || parsed.length === 0) {
      return [
        { q: 'ما هو أفضل نوع زجاج للواجهات التجارية؟', a: 'للواجهات التجارية نوصي بالزجاج المزدوج (Double Glass) لعزله الحراري والصوتي الممتاز، مع زجاج سيكوريت بسماكة 10-12 ملم للأبواب.' },
        { q: 'كم يستغرق تنفيذ مشروع كبائن شاور؟', a: 'كبائن الشاور الستاندرد تستغرق 1-2 يوم من أخذ المقاسات حتى التركيب النهائي.' },
        { q: 'هل تقدمون خدمة المعاينة المجانية؟', a: 'نعم، نقدم معاينة ميدانية مجانية لجميع المشاريع داخل الرياض.' },
        { q: 'ما هي مدة وشروط الضمان؟', a: 'نقدم ضماناً شاملاً يصل إلى 10 سنوات على جودة الزجاج المستخدم، وضماناً على التركيب والإكسسوارات.' }
      ];
    }
    return parsed.filter(f => !f.isHidden).map(f => ({
      q: f.question,
      a: f.answer
    }));
  }, [faqContent]);
"""

# Insert hook_code_2 after the services useMemo
content = content.replace("}, [servicesContent]);\n", "}, [servicesContent]);\n" + hook_code_2)

# Replace testimonials
old_testi = """          <div className="testi-grid">
            <div className="testi-card reveal reveal-delay-1">
              <div className="testi-stars">
                {[1,2,3,4,5].map(k => <svg key={k} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
              </div>
              <p className="testi-text">الواجهة الزجاجية للفيلا طلعت تحفة فنية. الدقة في المواعيد وجودة الزجاج المزدوج (عزل حراري وصوتي) كانت فوق الممتاز. يعطيهم العافية على هالشغل.</p>
              <div className="testi-divider"></div>
              <div className="testi-author">
                <div className="testi-avatar-initial">م</div>
                <div>
                  <div className="testi-name">م. خالد الدوسري</div>
                  <div className="testi-role">مالك فيلا — حي الياسمين، الرياض</div>
                </div>
              </div>
            </div>
            <div className="testi-card reveal reveal-delay-2">
              <div className="testi-stars">
                {[1,2,3,4,5].map(k => <svg key={k} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
              </div>
              <p className="testi-text">كبائن الشاور اللي ركبوها لنا في الفيلا جميلة جداً والشغل نظيف ومرتب. الفريق محترم وما خلّف أي وسخة بعد التركيب. أنصح بالتعامل معهم بكل ثقة.</p>
              <div className="testi-divider"></div>
              <div className="testi-author">
                <div className="testi-avatar-initial">ف</div>
                <div>
                  <div className="testi-name">أبو فيصل الشهري</div>
                  <div className="testi-role">مالك فيلا — حي الملقا، الرياض</div>
                </div>
              </div>
            </div>
            <div className="testi-card reveal reveal-delay-3">
              <div className="testi-stars">
                {[1,2,3,4,5].map(k => <svg key={k} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
              </div>
              <p className="testi-text">القواطع الزجاجية حوّلت مكاتبنا. الآن بيئة العمل أجمل وأكثر إنتاجية. السرعة في التنفيذ كانت مذهلة — أنجزوا في يومين ما كنا نتوقعه في أسبوع.</p>
              <div className="testi-divider"></div>
              <div className="testi-author">
                <div className="testi-avatar-initial">ع</div>
                <div>
                  <div className="testi-name">عبدالله المطيري</div>
                  <div className="testi-role">المدير التنفيذي — شركة رؤية المستقبل</div>
                </div>
              </div>
            </div>
          </div>"""

new_testi = """          <div className="testi-grid">
            {testimonials.slice(0, 3).map((t, i) => (
              <div key={i} className={`testi-card reveal reveal-delay-${i+1}`}>
                <div className="testi-stars">
                  {[1,2,3,4,5].map(k => <svg key={k} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                </div>
                <p className="testi-text">{t.text}</p>
                <div className="testi-divider"></div>
                <div className="testi-author">
                  <div className="testi-avatar-initial">{t.initial}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>"""
content = content.replace(old_testi, new_testi)

old_faq = """          <div className="faq-list reveal">
            {[
              { q: 'ما هو أفضل نوع زجاج للواجهات التجارية؟', a: 'للواجهات التجارية نوصي بالزجاج المزدوج (Double Glass) لعزله الحراري والصوتي الممتاز، مع زجاج سيكوريت بسماكة 10-12 ملم للأبواب. نقدم استشارة مجانية لتحديد الأنسب لمشروعك.' },
              { q: 'كم يستغرق تنفيذ مشروع كبائن شاور؟', a: 'كبائن الشاور الستاندرد تستغرق 1-2 يوم من أخذ المقاسات حتى التركيب النهائي. الكبائن المخصصة ذات الأبعاد الكبيرة قد تحتاج 3-5 أيام. نحدد الجدول الزمني الدقيق بعد المعاينة.' },
              { q: 'هل تقدمون خدمة المعاينة المجانية؟', a: 'نعم، نقدم معاينة ميدانية مجانية لجميع المشاريع داخل الرياض. فريقنا يزورك لأخذ المقاسات الدقيقة، تقديم الاستشارة، وتقديم عرض السعر التفصيلي — كل ذلك بدون أي رسوم.' },
              { q: 'ما هي مدة وشروط الضمان؟', a: 'نقدم ضماناً شاملاً يصل إلى 10 سنوات على جودة الزجاج المستخدم، وضماناً على التركيب والإكسسوارات. الضمان يشمل أي عيوب في المواد أو التركيب ولا يشمل الأضرار الناتجة عن سوء الاستخدام.' },
              { q: 'كيف أحافظ على نظافة ولمعان الزجاج؟', a: 'استخدم منظفات الزجاج المخصصة وقطعة قماش مايكروفايبر. تجنب المواد الكاشطة والشفرات الحادة. لكبائن الشاور، امسح الزجاج بعد كل استخدام لمنع التكلسات. نقدم لكل عميل دليل عناية مجاني عند التسليم.' }
            ].map((f, i) => ("""

new_faq = """          <div className="faq-list reveal">
            {faqs.map((f, i) => ("""

content = content.replace(old_faq, new_faq)

with open('src/pages/public/Home.tsx', 'w') as f:
    f.write(content)
print("Updated Home.tsx with dynamic testimonials and faq")
