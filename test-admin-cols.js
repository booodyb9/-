import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAdmin() {
  const { data, error } = await supabase.from('admins').select('*').limit(1)
  if (error) {
    console.error("Admin check failed:", error)
  } else {
    console.log("Admin check successful:", data)
  }
}

testAdmin()
