import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSlugs() {
  const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'booodyb9@gmail.com',
    password: '01097087703body'
  });
  
  const { data: currentContentData } = await supabase.from('contents').select('*').eq('key', 'premium_portfolio_projects').single();
  let projects = JSON.parse(currentContentData.body || '[]');
  
  projects = projects.map(p => {
    p.isFeatured = true; // Set to true so they appear on homepage!
    return p;
  });
  
  await supabase.from('contents').upsert({
    key: 'premium_portfolio_projects',
    title: 'Premium Portfolio Projects',
    type: 'json',
    body: JSON.stringify(projects),
    updated_at: new Date().toISOString()
  }, { onConflict: 'key' });
  console.log("Done");
}

checkSlugs();
