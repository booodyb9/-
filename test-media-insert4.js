import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
  const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'booodyb9@gmail.com',
    password: '01097087703body'
  })
  
  const newImage = { 
    name: 'test.jpg',
    url: 'https://example.com/test.jpg',
  };
  const { data, error } = await supabase.from('media').insert([newImage]).select();
  console.log("Insert result:", data, error)
}

testInsert()
