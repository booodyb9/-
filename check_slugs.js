import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSlugs() {
  const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'booodyb9@gmail.com',
    password: '01097087703body'
  })
  
  const { data: currentContentData } = await supabase.from('contents').select('*').eq('key', 'premium_portfolio_projects').single();
  let projects = JSON.parse(currentContentData.body || '[]');
  
  let changed = false;
  projects = projects.map(p => {
    if (!p.slug) {
      p.slug = p.id || Math.random().toString(36).substring(7);
      changed = true;
    }
    if (!p.coverImage && p.image) {
      p.coverImage = p.image;
      changed = true;
    }
    if (!p.galleryImages || p.galleryImages.length === 0) {
      p.galleryImages = p.coverImage ? [p.coverImage] : [];
      changed = true;
    }
    return p;
  });
  
  if (changed) {
    console.log("Fixing slugs!");
    await supabase.from('contents').upsert({
      key: 'premium_portfolio_projects',
      title: 'Premium Portfolio Projects',
      type: 'json',
      body: JSON.stringify(projects),
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' });
  } else {
    console.log("All projects have slugs.");
  }
}

checkSlugs()
