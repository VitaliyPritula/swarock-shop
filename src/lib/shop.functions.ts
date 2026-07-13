import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

function serverClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function listCategories() {
  const sb = serverClient();
  const { data, error } = await sb.from("categories").select("*").order("sort");
  if (error) throw new Error(error.message);
  return data ?? [];
}

// ─── Products ─────────────────────────────────────────────────────────────────

type ListProductsParams = {
  category?: string;
  onlyNew?: boolean;
  onlyPopular?: boolean;
  limit?: number;
};

export async function listProducts(params: ListProductsParams = {}) {
  const sb = serverClient();
  let q = sb
    .from("products")
    .select("id,slug,name,price,image_url,is_new,is_popular,category_id,categories(slug,name)")
    .order("created_at", { ascending: false });

  if (params.category) {
    const { data: cat } = await sb
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .maybeSingle();
    if (cat) q = q.eq("category_id", cat.id);
  }

  if (params.onlyNew) q = q.eq("is_new", true);
  if (params.onlyPopular) q = q.eq("is_popular", true);
  if (params.limit) q = q.limit(params.limit);

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProduct(slug: string) {
  const sb = serverClient();
  const { data, error } = await sb
    .from("products")
    .select("*,categories(slug,name),product_variants(id,size,stock)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function searchProducts(q: string) {
  const sb = serverClient();
  const term = `%${q}%`;
  const { data } = await sb
    .from("products")
    .select("id,slug,name,price,image_url")
    .ilike("name", term)
    .limit(30);
  return data ?? [];
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function listBlog() {
  const sb = serverClient();
  const { data } = await sb
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function getBlogPost(slug: string) {
  const sb = serverClient();
  const { data } = await sb
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

const OrderItemSchema = z.object({
  productId: z.string().uuid(),
  name: z.string(),
  size: z.string().nullable(),
  qty: z.number().int().min(1).max(50),
  price: z.number().min(0),
});

const OrderSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(100),
  address: z.string().trim().min(2).max(300),
  payment: z.enum(["cod", "card"]),
  comment: z.string().trim().max(500).optional().or(z.literal("")),
  items: z.array(OrderItemSchema).min(1),
});

export type OrderInput = z.infer<typeof OrderSchema>;

export async function createOrder(input: unknown) {
  const data = OrderSchema.parse(input);
  const sb = serverClient();

  const total = data.items.reduce((s, x) => s + x.qty * x.price, 0);

  const { data: order, error } = await sb
    .from("orders")
    .insert({
      user_id: null,
      status: "new",
      total,
      customer_name: data.name,
      customer_phone: data.phone,
      customer_email: data.email || null,
      shipping_city: data.city,
      shipping_address: data.address,
      payment_method: data.payment,
      comment: data.comment || null,
    })
    .select("id")
    .single();

  if (error || !order) throw new Error(error?.message ?? "Order failed");

  const { error: itemsErr } = await sb.from("order_items").insert(
    data.items.map((i) => ({
      order_id: order.id,
      product_id: i.productId,
      product_name: i.name,
      size: i.size,
      qty: i.qty,
      price: i.price,
    }))
  );

  if (itemsErr) throw new Error(itemsErr.message);

  return { orderId: order.id, total };
}