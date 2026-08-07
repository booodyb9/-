create or replace function public.mirror_lead_to_messages()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  insert into public.messages(name, phone, service, message, hp, is_read)
  values (
    new.name,
    new.phone,
    new.service,
    concat_ws(E'\n',
      nullif(new.message, ''),
      case when new.calc_area is not null then 'المساحة التقديرية: ' || new.calc_area::text end,
      case when new.calc_type is not null then 'نوع الزجاج: ' || new.calc_type end,
      case when new.calc_price is not null then 'التقدير: ' || new.calc_price::text || ' ر.س' end,
      'المصدر: ' || new.source
    ),
    '',
    false
  );
  return new;
end;
$$;

drop trigger if exists leads_mirror_to_messages on public.leads;
create trigger leads_mirror_to_messages
after insert on public.leads
for each row execute function public.mirror_lead_to_messages();
