import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSchema() {
  const { data, error } = await supabase.from('media').select('*').limit(1)
  console.log("Media schema test:", data, error)
}

testSchema()
