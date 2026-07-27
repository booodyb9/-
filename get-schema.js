import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
async function go() {
  const { data, error } = await supabase.from('media').select('*').limit(1)
  console.log("Empty select:", data, error)
  const newImage = { name: 'test', url: 'test', storage_path: 'test' };
  const { data: d2, error: e2 } = await supabase.from('media').insert([newImage]).select()
  console.log("Insert 1:", d2, e2)
}
go()
