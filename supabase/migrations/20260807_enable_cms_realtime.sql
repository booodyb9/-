do $$
declare
  table_name text;
  realtime_tables text[] := array[
    'contents','media','messages','projects','services','faqs','testimonials',
    'process_steps','features','hero_slides','trusted_partners','blog_posts',
    'project_timeline_stats','efficiency_stats','maintenance_tips','site_settings'
  ];
begin
  foreach table_name in array realtime_tables loop
    if to_regclass(format('public.%I', table_name)) is not null
       and not exists (
         select 1
         from pg_publication_tables
         where pubname = 'supabase_realtime'
           and schemaname = 'public'
           and tablename = table_name
       ) then
      execute format('alter publication supabase_realtime add table public.%I', table_name);
    end if;
  end loop;
end $$;
