import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testUpload() {
  const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'booodyb9@gmail.com',
    password: '01097087703body'
  })
  
  if (loginError) {
    console.error("Login failed:", loginError)
    return
  }

  const fileContent = "Fake image content"
  const blob = new Blob([fileContent], { type: 'image/jpeg' })
  const { data, error } = await supabase.storage.from('media').upload('test-image.jpg', blob, { upsert: true })
  console.log("Upload result:", data, error)
  
  const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl('test-image.jpg')
  console.log("Public URL:", publicUrlData)
}

testUpload()
