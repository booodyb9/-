import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function dumpAll() {
  const { data: currentContentData } = await supabase.from('contents').select('*').eq('key', 'premium_portfolio_projects').single();
  let projects = JSON.parse(currentContentData.body || '[]');
  console.log("Total:", projects.length);
  projects.forEach((p, i) => console.log(i, p.title, p.isFeatured, p.coverImage));
}
dumpAll()
