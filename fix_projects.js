import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixProjects() {
  const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'booodyb9@gmail.com',
    password: '01097087703body'
  })
  
  if (loginError) {
    console.error("Login failed:", loginError)
    return
  }

  const { data: currentContentData, error } = await supabase.from('contents').select('*').eq('key', 'premium_portfolio_projects').single();
  
  if (error) {
    console.error("Error fetching", error)
    return
  }
  
  let projects = [];
  if (currentContentData && currentContentData.body) {
     projects = JSON.parse(currentContentData.body);
  }
  
  let changed = false;
  const fixedProjects = projects.map(p => {
    if (p.image && !p.coverImage) {
      changed = true;
      return {
        ...p,
        slug: p.slug || p.id || Math.random().toString(36).substring(7),
        coverImage: p.image,
        galleryImages: [p.image],
        location: p.location || '',
        serviceType: p.serviceType || '',
        client: p.client || '',
        completionDate: p.completionDate || '',
        materialsUsed: p.materialsUsed || '',
        isFeatured: p.isFeatured || false,
        isHidden: p.isHidden || false,
        order: p.order || p.order_index || 0,
        seoTitle: p.seoTitle || '',
        seoDescription: p.seoDescription || ''
      }
    }
    return p;
  });
  
  if (changed) {
    const { error: updateError } = await supabase.from('contents').upsert({
      key: 'premium_portfolio_projects',
      title: 'Premium Portfolio Projects',
      type: 'json',
      body: JSON.stringify(fixedProjects),
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' });
    console.log("Fixed projects and updated DB!", updateError || "Success");
  } else {
    console.log("No broken projects found");
  }
}

fixProjects()
