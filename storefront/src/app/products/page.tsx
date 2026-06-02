'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../features/products/slices/productsSlice';
import { addToCart } from '../../features/cart/slices/cartSlice';
import { AppDispatch, RootState } from '../../store/store';
import { Navbar } from '@/components/site/navbar';
import { useStore } from '@/components/store-provider';
import { Search, SlidersHorizontal, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';

function ProductsContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector((s: RootState) => s.products);
  const { t, tr } = useStore();
  const searchParams = useSearchParams();

  const [search, setSearch]           = useState('');
  const [category, setCategory]       = useState('all');
  const [maxPrice, setMaxPrice]       = useState(10000);
  const [showFilters, setShowFilters] = useState(false);

  const CATEGORIES = [
    { slug: 'all',      label: { he: 'הכל',        ar: 'الكل' } },
    { slug: 'cement',   label: { he: 'מלט ובטון',  ar: 'اسمنت' } },
    { slug: 'steel',    label: { he: 'ברזל',        ar: 'حديد' } },
    { slug: 'blocks',   label: { he: 'בלוקים',      ar: 'بلوك' } },
    { slug: 'sand',     label: { he: 'חול',          ar: 'رمل' } },
    { slug: 'gravel',   label: { he: 'חצץ',          ar: 'حصى' } },
    { slug: 'tools',    label: { he: 'כלי עבודה',  ar: 'أدوات' } },
    { slug: 'paint',    label: { he: 'צבע',          ar: 'دهان' } },
    { slug: 'plumbing', label: { he: 'אינסטלציה',  ar: 'سباكة' } },
  ];

  // تحميل كل المنتجات عند أول تحميل
  useEffect(() => {
    dispatch(fetchProducts(undefined));
  }, [dispatch]);

  // قراءة category من الـ URL
  useEffect(() => {
    const cat = searchParams.get('category');
    setCategory(cat || 'all'); // ← دايماً يرجع لـ all لو ما في param
  }, [searchParams]);

  // فلترة محلية — search + category + price
  const filtered = products.filter((p: any) => {
    const matchSearch   = !search || p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'all' || p.category === category;
    const matchPrice    = p.price <= maxPrice;
    return matchSearch && matchCategory && matchPrice;
  });

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image || '',
      quantity: 1,
      stock: product.stock,
    }));
    toast.success(t.products.addedToCart);
  };

  const activeCatLabel = CATEGORIES.find(c => c.slug === category)?.label;

  return (
    <main className="mx-auto max-w-7xl px-4 py-28">

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{t.products.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} {t.cart.items}</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition',
            showFilters
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border/60 bg-background text-foreground hover:bg-muted',
          )}
        >
          <SlidersHorizontal size={15} />
          {t.products.filter}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.products.search}
          className="h-12 w-full rounded-xl border border-border/60 bg-card ps-11 pe-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-5">
          <div>
            <p className="mb-3 text-sm font-bold text-foreground">{t.products.categories}</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setCategory(cat.slug)}
                  className={cn(
                    'rounded-xl px-3.5 py-2 text-sm font-semibold transition',
                    category === cat.slug
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border/60 bg-background text-foreground hover:bg-muted',
                  )}
                >
                  {tr(cat.label)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold text-foreground">
              {t.products.maxPrice}: <span className="text-primary">₪{maxPrice.toLocaleString()}</span>
            </p>
            <input
              type="range" min={0} max={10000} step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>₪0</span><span>₪10,000</span>
            </div>
          </div>
        </div>
      )}

      {/* Active filter pill */}
      {category !== 'all' && activeCatLabel && (
        <div className="mb-5 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t.products.activeFilter}</span>
          <button
            onClick={() => setCategory('all')}
            className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20"
          >
            {tr(activeCatLabel)}
            <span className="text-primary/60">×</span>
          </button>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-border/60 bg-card">
              <div className="aspect-[4/3] animate-pulse bg-foreground/5" />
              <div className="space-y-3 p-4">
                <div className="h-3 w-16 animate-pulse rounded-lg bg-foreground/10" />
                <div className="h-4 w-full animate-pulse rounded-lg bg-foreground/10" />
                <div className="h-6 w-20 animate-pulse rounded-lg bg-foreground/10" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-4 font-bold text-foreground">{t.products.noResults}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.products.noResultsDesc}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {filtered.map((product: any) => (
            <div
              key={product._id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <Link href={`/products/${product._id}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-muted/40">
                  <Image
                    src={product.images?.[0] || product.image || `/images/products/${product.category}.png`}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
              </Link>

              <div className="flex flex-1 flex-col p-3 sm:p-4">
                <span className="text-xs font-semibold text-primary">{product.category}</span>
                <Link href={`/products/${product._id}`}>
                  <h3 className="mt-1 line-clamp-2 text-sm font-bold text-foreground transition hover:text-primary">
                    {product.name}
                  </h3>
                </Link>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="text-base font-black text-foreground">₪{product.price}</span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition hover:brightness-110 active:scale-95 disabled:opacity-40"
                  >
                    <ShoppingCart size={15} />
                  </button>
                </div>

                {product.stock === 0 && (
                  <p className="mt-1 text-xs text-destructive">{t.product.outOfStock}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }>
        <ProductsContent />
      </Suspense>
    </div>
  );
}