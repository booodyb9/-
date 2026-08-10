import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
  const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'booodyb9@gmail.com',
    password: '01097087703body'
  })
  
  if (loginError) {
    console.error("Login failed:", loginError)
    return
  }

  const newImage = { 
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'test.jpg',
    url: 'https://example.com/test.jpg',
    type: 'image',
    size: 1024,
    created_at: new Date().toISOString() 
  };
  const { data, error } = await supabase.from('media').insert([newImage]);
  console.log("Insert result:", data, error)
}

testInsert()
