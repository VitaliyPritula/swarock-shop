'use client';
import { useRouter } from "@/src/i18n/routing";
import { supabase } from "@/src/lovable/client";
import { Eye, EyeOff } from 'lucide-react';
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
};

type Address = {
  id: string;
  city: string;
  address: string;
  is_default: boolean;
};

type OrderItem = {
  id: string;
  product_name: string;
  size: string | null;
  qty: number;
  price: number;
};

type Order = {
  id: string;
  status: string;
  total: number;
  created_at: string;
  order_items: OrderItem[];
};

type Tab = "profile" | "orders" | "addresses";

export default function AccountPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Account");
  const statusLabels: Record<string, string> = {
    new: t("status.new"),
    processing: t("status.processing"),
    shipped: t("status.shipped"),
    delivered: t("status.delivered"),
    cancelled: t("status.cancelled"),
  };
  const [tab, setTab] = useState<Tab>("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [newAddress, setNewAddress] = useState("");

  // Password form
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth", { locale });
        return;
      }

      setEmail(user.email ?? "");

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
        setFullName(profileData.full_name ?? "");
        setPhone(profileData.phone ?? "");
      }

      const { data: ordersData } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setOrders((ordersData as Order[]) ?? []);

      const { data: addressesData } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      setAddresses(addressesData ?? []);
      setLoading(false);
    }

    load();
  }, [router]);

  async function saveProfile() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: fullName, phone });

    if (error) toast.error(error.message);
    else toast.success(t("profileSaved"));
    setSaving(false);
  }

  async function savePassword() {
    if (newPassword.length < 6) {
      toast.error(t("passwordMinLength"));
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error(error.message);
    else {
      toast.success(t("passwordChanged"));
      setNewPassword("");
    }
    setSavingPassword(false);
  }

  async function addAddress() {
    if (!newCity || !newAddress) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("addresses")
      .insert({ user_id: user.id, city: newCity, address: newAddress, is_default: addresses.length === 0 })
      .select()
      .single();

    if (error) toast.error(error.message);
    else {
      setAddresses((prev) => [...prev, data]);
      setNewCity("");
      setNewAddress("");
      setShowAddressForm(false);
      toast.success(t("addressAdded"));
    }
  }

  async function deleteAddress(id: string) {
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success(t("addressDeleted"));
    }
  }

  async function setDefaultAddress(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === id })));
    toast.success(t("defaultAddressUpdated"));
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/", { locale });
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">{t("loading")}</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl uppercase tracking-widest">{t("title")}</h1>
        <button onClick={signOut} className="text-sm text-muted-foreground hover:underline">
          {t("signOut")}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-8">
        {(["profile", "orders", "addresses"] as Tab[]).map((tabName) => (
          <button
            key={tabName}
            onClick={() => setTab(tabName)}
            className={`pb-2 text-sm uppercase tracking-widest font-display border-b-2 transition-colors ${tab === tabName ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              }`}
          >
            {t(`tabs.${tabName}`)}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === "profile" && (
        <div className="space-y-6 max-w-md">
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <input value={email} disabled className="mt-1 w-full rounded border px-3 py-2 bg-muted text-muted-foreground" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">{t("name")}</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)}
              placeholder={t("namePlaceholder")} className="mt-1 w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">{t("phone")}</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="+38 0XX XXX XX XX" className="mt-1 w-full rounded border px-3 py-2" />
          </div>
          <button onClick={saveProfile} disabled={saving}
            className="w-full rounded bg-primary py-2 text-white font-display uppercase tracking-widest disabled:opacity-60">
            {saving ? t("saving") : t("save")}
          </button>

          <hr className="my-6" />

          <h3 className="font-display uppercase tracking-widest text-sm">{t("changePassword")}</h3>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("newPassword")} minLength={6} className="w-full rounded border px-3 py-2 pr-10" />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-900 hover:text-slate-900"
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <button onClick={savePassword} disabled={savingPassword}
            className="w-full rounded border py-2 text-sm font-display uppercase tracking-widest disabled:opacity-60">
            {savingPassword ? t("saving") : t("changePassword")}
          </button>
        </div>
      )}

      {/* Orders Tab */}
      {tab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-muted-foreground">{t("noOrders")}</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="rounded border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString(locale === "uk" ? "uk-UA" : "en-GB")}
                  </span>
                  <span className={`text-xs font-semibold uppercase px-2 py-1 rounded ${order.status === "delivered" ? "bg-green-100 text-green-700" :
                    order.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                    {statusLabels[order.status] ?? order.status}
                  </span>
                </div>
                <ul className="space-y-1 text-sm">
                  {order.order_items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.product_name} {item.size ? `(${item.size})` : ""} × {item.qty}</span>
                      <span>{(item.price * item.qty).toFixed(0)} ₴</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end font-semibold">
                  {t("total")} {order.total.toFixed(0)} ₴
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Addresses Tab */}
      {tab === "addresses" && (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="rounded border p-4 flex items-start justify-between">
              <div>
                <p className="font-medium">{addr.city}, {addr.address}</p>
                {addr.is_default && (
                  <span className="text-xs text-green-600">{t("defaultAddress")}</span>
                )}
              </div>
              <div className="flex gap-2 text-sm">
                {!addr.is_default && (
                  <button onClick={() => setDefaultAddress(addr.id)} className="text-blue-500 hover:underline">
                    {t("makeDefault")}
                  </button>
                )}
                <button onClick={() => deleteAddress(addr.id)} className="text-red-500 hover:underline">
                  {t("delete")}
                </button>
              </div>
            </div>
          ))}

          {showAddressForm ? (
            <div className="rounded border p-4 space-y-3">
              <input value={newCity} onChange={(e) => setNewCity(e.target.value)}
                placeholder={t("city")} className="w-full rounded border px-3 py-2" />
              <input value={newAddress} onChange={(e) => setNewAddress(e.target.value)}
                placeholder={t("streetAddress")} className="w-full rounded border px-3 py-2" />
              <div className="flex gap-2">
                <button onClick={addAddress}
                  className="flex-1 rounded bg-primary py-2 text-white text-sm font-display uppercase tracking-widest">
                  {t("add")}
                </button>
                <button onClick={() => setShowAddressForm(false)}
                  className="flex-1 rounded border py-2 text-sm">
                  {t("cancel")}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddressForm(true)}
              className="w-full rounded border py-2 text-sm font-display uppercase tracking-widest">
              + {t("addAddress")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}