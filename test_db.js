import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
    const { data, error } = await supabase.rpc('get_tables');
    // Supabase JS doesn't have a built in get tables if no RPC exists, but we can query pg_tables if we had direct access
    // Instead we can just do a rest call to supabase URL
}
check();
