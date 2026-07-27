import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testTable() {
  const { data, error } = await supabase.from('media').select('*').limit(5)
  console.log("Media records:", data, error)
}

testTable()
