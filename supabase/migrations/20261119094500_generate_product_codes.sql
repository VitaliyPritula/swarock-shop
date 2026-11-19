create sequence public.products_code_seq
  as bigint
  minvalue 14081488
  maxvalue 99999999
  start with 14081488
  increment by 1
  no cycle;

with numbered_products as (
  select id, row_number() over (order by created_at, id) as row_num
  from public.products
)
update public.products as p
set code = (14081487 + numbered_products.row_num)::text
from numbered_products
where p.id = numbered_products.id;

select case
  when count(*) = 0 then setval('public.products_code_seq', 14081488, false)
  else setval('public.products_code_seq', 14081487 + count(*), true)
end
from public.products;

alter table public.products
  alter column code set default nextval('public.products_code_seq')::text,
  alter column code set not null;

create unique index products_code_unique_idx
  on public.products (code);
