import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testUpload() {
  const fileContent = "Hello, world!"
  const blob = new Blob([fileContent], { type: 'text/plain' })
  const { data, error } = await supabase.storage.from('media').upload('test.txt', blob, { upsert: true })
  console.log("Upload result:", data, error)
}

testUpload()
