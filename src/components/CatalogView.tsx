'use client';
import { Link, usePathname } from '@/src/i18n/routing';
import { uah } from "@/src/lib/format";
import { img } from "@/src/lib/images";
import { ChevronDown, LayoutGrid, List, Search, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ProductCard, type ProductCardData } from "./ProductCard";

type Category = { id: string; slug: string; name: string };
type Product = ProductCardData & {
  id: string;
  is_new?: boolean;
  is_popular?: boolean;
  product_variants?: { size: string }[] | null;
  material?: string | null;
  gender?: string | null;
};

type Sort = "popular" | "new" | "price-asc" | "price-desc" | "name";
const PER_PAGE = 12;

function FilterGroup({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left font-display text-sm uppercase tracking-widest"
      >
        {title}
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className="grid transition-all duration-300 ease-in-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <div className="pt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange, label, count, labelClassName }: { checked: boolean; onChange: () => void; label: React.ReactNode; count?: number; labelClassName?: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 shrink-0 accent-[color:var(--brand)]" />
      <span className={`min-w-0 flex-1 ${labelClassName ?? ""}`}>{label}</span>
      {count !== undefined && <span className="text-xs text-muted-foreground">({count})</span>}
    </label>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 text-sm text-foreground transition hover:text-[color:var(--brand)]"
    >
      <span>{label}</span>
      <X className="h-3.5 w-3.5" />
    </button>
  );
}

export function CatalogView({
  title,
  products,
  categories,
  activeCategorySlug,
}: {
  title: string;
  products: Product[];
  categories: Category[];
  activeCategorySlug?: string;
}) {
  const pathname = usePathname();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 5000 };
    const prices = products.map((p) => p.price);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [products]);

  const allSizes = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) => p.product_variants?.forEach((v) => s.add(v.size)));
    return Array.from(s).sort();
  }, [products]);

  const allMaterials = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach((p) => {
      if (p.material) m.set(p.material, (m.get(p.material) ?? 0) + 1);
    });
    return Array.from(m.entries()).sort();
  }, [products]);

  const [priceMin, setPriceMin] = useState(priceBounds.min);
  const [priceMax, setPriceMax] = useState(priceBounds.max);
  const [sizes, setSizes] = useState<Set<string>>(new Set());
  const [materials, setMaterials] = useState<Set<string>>(new Set());
  const [showAllStaticMaterials, setShowAllStaticMaterials] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlyPopular, setOnlyPopular] = useState(false);
  const [productions, setProductions] = useState<Set<string>>(new Set());
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [sort, setSort] = useState<Sort>("popular");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [matQuery, setMatQuery] = useState("");
  const [showAllMat, setShowAllMat] = useState(false);

  const toggle = (set: Set<string>, setter: (s: Set<string>) => void, v: string) => {
    const n = new Set(set);
    if (n.has(v)) n.delete(v); else n.add(v);
    setter(n);
    setPage(1);
  };

  const priceTouched = priceMin !== priceBounds.min || priceMax !== priceBounds.max;

  const chips: { key: string; label: string; remove: () => void }[] = [
    ...Array.from(sizes).map((s) => ({
      key: `size-${s}`,
      label: s.toUpperCase(),
      remove: () => toggle(sizes, setSizes, s),
    })),
    ...Array.from(materials).map((m) => ({
      key: `mat-${m}`,
      label: m,
      remove: () => toggle(materials, setMaterials, m),
    })),
    ...(onlyNew ? [{ key: "new", label: "Новинки", remove: () => { setOnlyNew(false); setPage(1); } }] : []),
    ...(onlyPopular ? [{ key: "pop", label: "Популярні", remove: () => { setOnlyPopular(false); setPage(1); } }] : []),
    ...(priceTouched
      ? [{
        key: "price",
        label: `${priceMin} — ${priceMax} грн.`,
        remove: () => { setPriceMin(priceBounds.min); setPriceMax(priceBounds.max); setPage(1); },
      }]
      : []),
    ...(gender
      ? [{ key: "gender", label: gender === "male" ? "Чоловічі" : "Жіночі", remove: () => { setGender(""); setPage(1); } }]
      : []),
    ...Array.from(productions).map((p) => ({ key: `prod-${p}`, label: p, remove: () => { const n = new Set(productions); n.delete(p); setProductions(n); setPage(1); } })),
  ];

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      if (p.price < priceMin || p.price > priceMax) return false;
      if (onlyNew && !p.is_new) return false;
      if (onlyPopular && !p.is_popular) return false;
      if (sizes.size > 0) {
        const has = p.product_variants?.some((v) => sizes.has(v.size));
        if (!has) return false;
      }
      if (gender) {
        const g = String(p.gender ?? "").toLowerCase();
        const isMale = ["m", "male", "чоловічий", "чоловічі", "men"].includes(g);
        const isFemale = ["f", "female", "жіночий", "жіночі", "women"].includes(g);
        if (gender === "male" && !isMale) return false;
        if (gender === "female" && !isFemale) return false;
      }
      if (productions.size > 0) {
        const rec = p as unknown as Record<string, unknown>;
        const originRaw = String((rec.country ?? rec.origin ?? rec.manufacturer ?? p.material ?? p.name ?? "")).toLowerCase();
        const map: Record<string, string[]> = {
          "Україна": ["ukraine", "україна", "ua"],
          "США": ["usa", "us", "сша", "united states", "america"],
          "Китай": ["china", "китай", "cn"],
        };
        const anyMatch = Array.from(productions).some((pr) => map[pr]?.some((kw) => originRaw.includes(kw)) ?? false);
        if (!anyMatch) return false;
      }
      if (materials.size > 0 && (!p.material || !materials.has(p.material))) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "name": return a.name.localeCompare(b.name);
        case "popular": return Number(!!b.is_popular) - Number(!!a.is_popular);
        default: return Number(!!b.is_new) - Number(!!a.is_new);
      }
    });
  }, [products, priceMin, priceMax, onlyNew, onlyPopular, sizes, materials, sort, gender, productions]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const reset = () => {
    setPriceMin(priceBounds.min);
    setPriceMax(priceBounds.max);
    setSizes(new Set());
    setMaterials(new Set());
    setOnlyNew(false);
    setOnlyPopular(false);
    setProductions(new Set());
    setGender("");
    setPage(1);
  };

  const visibleMaterials = allMaterials
    .filter(([m]) => m.toLowerCase().includes(matQuery.trim().toLowerCase()))
    .slice(0, showAllMat ? undefined : 8);

  const sortLinks: { v: Sort; label: string }[] = [
    { v: "popular", label: "Популярності" },
    { v: "new", label: "Новизні" },
    { v: "price-asc", label: "Ціні" },
  ];

  const activeLinkClass = "text-[color:var(--brand)] font-semibold";

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-8">
      <nav className="mb-4 text-xs text-muted-foreground">
        <Link href="/" className="hover:underline">Головна</Link>
        <span className="mx-2">/</span>
        <Link href="/catalog" className="hover:underline">Каталог</Link>
        {activeCategorySlug && <><span className="mx-2">/</span><span>{title}</span></>}
      </nav>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">
        {isFilterOpen && (
          <button
            type="button"
            aria-label="Закрити фільтри"
            onClick={() => setIsFilterOpen(false)}
            className="fixed inset-0 z-40 bg-primary/50 md:hidden"
          />
        )}
        <aside className={`${isFilterOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-[min(320px,calc(100vw-32px))] overflow-y-auto bg-background px-4 py-6 text-sm transition-transform duration-300 md:static md:z-auto md:w-auto md:translate-x-0 md:overflow-visible md:px-0 md:py-0`}>
          <div className="mb-4 flex items-center justify-between md:hidden">
            <span className="font-display text-sm uppercase tracking-widest">Фільтри</span>
            <button type="button" onClick={() => setIsFilterOpen(false)} aria-label="Закрити фільтри" className="rounded p-1">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mb-4 bg-foreground px-4 py-3 text-center font-display text-sm uppercase tracking-widest text-background">
            Фільтри
          </div>
          <div className="">
            <h3 className="my-4 text-center text-lg">Стать</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === "male"}
                  onChange={() => { setGender("male"); setPage(1); }}
                  className="h-4 w-4"
                />
                <span>Чоловічі</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === "female"}
                  onChange={() => { setGender("female"); setPage(1); }}
                  className="h-4 w-4"
                />
                <span>Жіночі</span>
              </label>
            </div>
          </div>
          <div className="">
            <h3 className="my-4 text-center text-lg">Виробництво</h3>
            <div className="flex flex-col gap-2">
              <Checkbox checked={productions.has("Україна")} onChange={() => toggle(productions, setProductions, "Україна")} label="Україна" />
              <Checkbox checked={productions.has("США")} onChange={() => toggle(productions, setProductions, "США")} label="США" />
              <Checkbox checked={productions.has("Китай")} onChange={() => toggle(productions, setProductions, "Китай")} label="Китай" />
            </div>
          </div>
          <FilterGroup title="Каталог">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/catalog"
                  className={pathname === "/catalog" ? activeLinkClass : undefined}
                >
                  Всі товари
                </Link>
              </li>
              {categories.map((c) => {
                const href = `/catalog/${c.slug}`;
                const isActive = pathname === href;
                return (
                  <li key={c.id}>
                    <Link href={href} className={isActive ? activeLinkClass : undefined}>
                      {c.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </FilterGroup>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => { setPriceMin(Number(e.target.value)); setPage(1); }}
                  className="w-full rounded border border-border bg-background px-2 py-1 text-center text-sm"
                />
                <span className="shrink-0 text-xs text-muted-foreground">грн.</span>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => { setPriceMax(Number(e.target.value)); setPage(1); }}
                  className="w-full rounded border border-border bg-background px-2 py-1 text-center text-sm"
                />
              </div>
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={priceMax}
                onChange={(e) => { setPriceMax(Number(e.target.value)); setPage(1); }}
                className="w-full accent-[color:var(--brand)]"
              />
            </div>
          </div>

          {allSizes.length > 0 && (
            <FilterGroup title="Розмір">
              <div className="flex flex-wrap gap-2">
                {allSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggle(sizes, setSizes, s)}
                    className={`min-w-[36px] rounded border px-2 py-1 text-xs uppercase transition ${sizes.has(s)
                      ? "border-[color:var(--brand)] bg-[color:var(--brand)] text-white"
                      : "border-border hover:border-foreground"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </FilterGroup>
          )}

          {allMaterials.length > 0 && (
            <FilterGroup title="Група/Бренд">
              <div className="relative mb-2">
                <input
                  value={matQuery}
                  onChange={(e) => setMatQuery(e.target.value)}
                  placeholder="Бавовна, наприклад..."
                  className="w-full rounded border border-border bg-background py-1.5 pl-2 pr-8 text-sm"
                />
                <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              {visibleMaterials.map(([m, count]) => (
                <Checkbox
                  key={m}
                  checked={materials.has(m)}
                  onChange={() => toggle(materials, setMaterials, m)}
                  label={m}
                  count={count}
                />
              ))}
              {allMaterials.length > 8 && (
                <button
                  onClick={() => setShowAllMat(!showAllMat)}
                  className="mt-2 ml-auto block text-xs text-muted-foreground underline hover:text-foreground"
                >
                  {showAllMat ? "Згорнути" : "Показати все"}
                </button>
              )}
            </FilterGroup>
          )}

          <FilterGroup title="Матеріали">
            {(() => {
              const staticMaterials = [
                "Хлопок",
                "Хлопок, полиэстер - 35%/65%",
                "Хлопок, полиэстер - 60%/30%",
                "Хлопок, полиэстер - 80%/20%",
                "Хлопок, полиэстер - 50%/20%",
                "Хлопок, полиэстер - 50%/20%",
                "Хлопок, полиэстер - 75%/20%",
              ];
              const visible = showAllStaticMaterials ? staticMaterials : staticMaterials.slice(0, 3);

              return (
                <>
                  {visible.map((m, i) => (
                    <Checkbox
                      key={`${m}-${i}`}
                      checked={materials.has(m)}
                      onChange={() => toggle(materials, setMaterials, m)}
                      label={m}
                      labelClassName="font-Regular text-primary text-[14px]"
                    />
                  ))}

                  {staticMaterials.length > 3 && (
                    <button
                      onClick={() => setShowAllStaticMaterials(!showAllStaticMaterials)}
                      className="mt-2 ml-auto block text-xs text-muted-foreground underline hover:text-foreground"
                    >
                      {showAllStaticMaterials ? "Згорнути" : "показати все"}
                    </button>
                  )}
                </>
              );
            })()}
          </FilterGroup>
        </aside>

        <section>
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="mb-4 flex w-full items-center justify-between border border-border px-4 py-3 text-sm uppercase tracking-widest md:hidden"
          >
            Фільтри
            <ChevronDown className="h-4 w-4" />
          </button>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-2xl uppercase tracking-widest">{title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-muted-foreground">Виводити по:</span>
              {sortLinks.map((s) => (
                <button
                  key={s.v}
                  onClick={() => { setSort(s.v); setPage(1); }}
                  className={`underline-offset-4 transition ${sort === s.v || (s.v === "price-asc" && sort === "price-desc")
                    ? "font-semibold text-[color:var(--brand)] underline"
                    : "text-foreground underline hover:text-[color:var(--brand)]"
                    }`}
                >
                  {s.label}
                </button>
              ))}
              <div className="hidden items-center gap-1 sm:flex">
                <button
                  onClick={() => setView("grid")}
                  aria-label="Сітка"
                  className={`rounded p-1.5 ${view === "grid" ? "bg-foreground text-background" : "text-muted-foreground"}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  aria-label="Список"
                  className={`rounded p-1.5 ${view === "list" ? "bg-foreground text-background" : "text-muted-foreground"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border pb-4">
              <span className="text-sm uppercase tracking-widest text-muted-foreground">Ваш вибір:</span>
              {chips.map((c) => <Chip key={c.key} label={c.label} onRemove={c.remove} />)}
              <button onClick={reset} className="text-xs uppercase tracking-widest text-[color:var(--brand)] hover:underline">
                Скинути все
              </button>
            </div>
          )}

          {pageItems.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">Нічого не знайдено. Спробуйте змінити фільтри.</p>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {pageItems.map((p) => (
                <ProductCard
                  key={p.id}
                  p={{
                    ...p,
                    sizes: p.product_variants?.map((v) => v.size) ?? [],
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {pageItems.map((p) => {
                const raw = img(p.image_url) as unknown;
                const src = typeof raw === "string" ? raw : (raw as { src?: string })?.src;
                return (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    className="flex gap-4 py-4 hover:bg-muted/30"
                  >
                    <Image src={src ?? ""} alt={p.name} width={96} height={96} className="h-24 w-24 bg-white object-contain" />
                    <div className="flex flex-1 flex-col justify-center">
                      <div className="text-sm font-medium uppercase">{p.name}</div>
                      {p.material && <div className="text-xs text-muted-foreground">{p.material}</div>}
                      <div className="mt-1 font-display text-lg">{uah(p.price)}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded border border-border px-3 py-1 text-sm disabled:opacity-40"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-8 w-8 rounded text-sm ${n === currentPage
                    ? "bg-[color:var(--brand)] text-white"
                    : "border border-border hover:border-foreground"
                    }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded border border-border px-3 py-1 text-sm disabled:opacity-40"
              >
                →
              </button>
            </div>
          )}

          <div className="mt-4 text-center text-xs text-muted-foreground">
            Показано {pageItems.length} з {filtered.length}
          </div>
        </section>
      </div>
    </div>
  );
}