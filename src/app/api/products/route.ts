import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function serverClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sp = url.searchParams;

  const page = Number(sp.get('page') || '1');
  const perPage = Number(sp.get('perPage') || '12');
  const sort = sp.get('sort') || 'new';
  const priceMin = Number(sp.get('priceMin') || '0');
  const priceMax = Number(sp.get('priceMax') || '999999');
  const onlyNew = sp.get('onlyNew') === '1';
  const onlyPopular = sp.get('onlyPopular') === '1';
  const category = sp.get('category') || undefined;
  const sizes = sp.getAll('sizes');
  const materials = sp.getAll('materials');

  const sb = serverClient();

  try {
    function buildQuery() {
      let q = sb
        .from('products')
        .select('id,code,slug,name,price,image_url,is_new,is_popular,material')
        .order(sort === 'new' ? 'created_at' : sort.startsWith('price') ? 'price' : 'name');

      return q;
    }

    // apply filters by rebuilding query
    let base = buildQuery();

    if (category) {
      const { data: cat } = await sb.from('categories').select('id').eq('slug', category).maybeSingle();
      if (cat) base = base.eq('category_id', cat.id);
    }

    if (onlyNew) base = base.eq('is_new', true);
    if (onlyPopular) base = base.eq('is_popular', true);
    if (!Number.isNaN(priceMin)) base = base.gte('price', priceMin);
    if (!Number.isNaN(priceMax)) base = base.lte('price', priceMax);
    if (materials.length > 0) base = base.in('material', materials);

    // sizes filter requires looking up product ids from product_variants
    if (sizes.length > 0) {
      const { data: rows } = await sb.from('product_variants').select('product_id').in('size', sizes as string[]);
      const ids = Array.from(new Set((rows ?? []).map((r: any) => r.product_id)));
      if (ids.length === 0) {
        return NextResponse.json({ items: [], total: 0 });
      }
      base = base.in('id', ids);
    }

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data: all } = await base.select('*');
    const total = (all ?? []).length;

    const { data, error } = await base.range(from, to).select('*');
    if (error) throw error;

    return NextResponse.json({ items: data ?? [], total });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err?.message || 'Server error' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
