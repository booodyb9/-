import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ealfhhvegfnelkvdpbfx.supabase.co";
const supabaseAnonKey = "sb_publishable_XSqXQrHHKWfyWlfRyYBuKQ_zGnS_5R";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('projects').select('*');
  console.log('Projects:', data, error);
}
test();
