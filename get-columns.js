import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAdmin() {
  const { data, error } = await supabase.from('admins').select('*')
  console.log(data, error)
}

testAdmin()
