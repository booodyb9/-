import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkProjects() {
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
  
  console.log("Total projects:", projects.length);
  for (let i = 0; i < Math.min(5, projects.length); i++) {
    console.log(`Project ${i}:`, projects[i]);
  }
}

checkProjects()
