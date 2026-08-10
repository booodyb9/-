import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixBucket() {
  const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'booodyb9@gmail.com',
    password: '01097087703body'
  })
  
  if (loginError) {
    console.error("Login failed:", loginError)
    return
  }

  // Create bucket
  const { data: createData, error: createError } = await supabase.storage.createBucket('media', {
    public: true,
    fileSizeLimit: 1024 * 1024 * 50 // 50MB
  })
  console.log("Create bucket:", createData, createError)
}

fixBucket()
