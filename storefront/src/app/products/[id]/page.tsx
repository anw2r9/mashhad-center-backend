'use client';
import { use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../../../features/products/slices/productsSlice';
import { AppDispatch, RootState } from '../../../store/store';
import { Navbar } from '@/components/site/navbar';
import { useStore } from '@/components/store-provider';
import { ShoppingCart, ArrowRight, Package, Star, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import api from '../../../lib/axios';
import { toast } from 'react-toastify';

const categoryImage: Record<string, string> = {
  cement:   '/images/products/cement.png',
  steel:    '/images/products/steel.png',
  blocks:   '/images/products/blocks.png',
  sand:     '/images/products/sand.png',
  gravel:   '/images/products/gravel.png',
  tools:    '/images/products/tools.png',
  paint:    '/images/products/paint.png',
  plumbing: '/images/products/plumbing.png',
}

function getProductImg(product: any) {
  if (product.images?.length) return product.images[0];
  if (product.image) return product.image;
  return categoryImage[product.category] ?? '/images/products/cement.png';
}

function RatingSection({ productId, currentRating }: { productId: string; currentRating: number }) {
  const { user } = useSelector((s: RootState) => s.auth);
  const { t, locale } = useStore();
  const [hover, setHover]       = useState(0);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading]   = useState(false);

  const handleRate = async (value: number) => {
    if (!user) {
      toast.error(locale === 'he' ? 'התחבר כדי לדרג' : 'سجّل دخولك أولاً للتقييم');
      return;
    }
    setSelected(value);
    setLoading(true);
    try {
      await api.post(`/products/${productId}/rating`, { rating: value });
      toast.success(locale === 'he' ? 'הדירוג נשלח ✅' : 'تم إرسال تقييمك ✅');
    } catch (err: any) {
      toast.error(err.response?.data?.message || (locale === 'he' ? 'שגיאה' : 'حدث خطأ'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-bold text-foreground">
        {locale === 'he' ? 'דירוג המוצר' : 'تقييم المنتج'}
      </h3>
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-0.5 me-3">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className={`h-4 w-4 ${i <= Math.round(currentRating) ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
          ))}
          <span className="ms-1.5 text-sm font-semibold text-foreground">{currentRating?.toFixed(1) || '—'}</span>
        </div>
        <span className="text-muted-foreground/40">|</span>
        <div className="flex items-center gap-0.5 ms-3">
          {[1,2,3,4,5].map(i => (
            <button key={i} disabled={loading}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleRate(i)}
              className="transition hover:scale-110 disabled:opacity-50">
              <Star className={`h-5 w-5 ${i <= (hover || selected) ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
            </button>
          ))}
        </div>
        <span className="ms-2 text-xs text-muted-foreground">
          {locale === 'he' ? 'דרג' : 'قيّم'}
        </span>
      </div>
    </div>
  );
}

function SimilarProducts({ productId }: { productId: string }) {
  const [similar, setSimilar] = useState<any[]>([]);

  useEffect(() => {
    api.get(`/products/${productId}/similar`)
      .then(r => setSimilar(r.data.data?.slice(0, 4) || []))
      .catch(() => {});
  }, [productId]);

  if (!similar.length) return null;

  const { locale } = useStore();

  return (
    <div className="mt-12">
      <h2 className="mb-5 text-lg font-extrabold text-foreground">
        {locale === 'he' ? 'מוצרים דומים' : 'منتجات مشابهة'}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {similar.map((p: any) => (
          <Link key={p._id} href={`/products/${p._id}`}
            className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="relative aspect-[4/3] overflow-hidden bg-muted/40">
              <Image src={p.images?.[0] || '/images/products/cement.png'} alt={p.name}
                fill className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw" />
            </div>
            <div className="p-3">
              <p className="line-clamp-2 text-xs font-bold text-foreground">{p.name}</p>
              <p className="mt-1 text-sm font-black text-primary">₪{p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dispatch = useDispatch<AppDispatch>();
  const { product, loading, error } = useSelector((s: RootState) => s.products);
  const { t, locale, addToCart, pushToast } = useStore();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) dispatch(fetchProduct(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!product) return;
    // استخدم useStore addToCart عشان يتزامن مع cartCount بالـ Navbar
    addToCart({
      id: product._id,
      name: { he: product.name, ar: product.name },
      price: product.price,
      image: getProductImg(product),
      stock: product.stock,
      categorySlug: product.category,
    } as any, quantity);
    setQuantity(1);
  };

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-28">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="h-96 animate-pulse rounded-2xl bg-foreground/5" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 animate-pulse rounded-xl bg-foreground/5" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-40 text-center">
        <p className="text-5xl">📦</p>
        <h2 className="mt-4 text-xl font-bold text-foreground">{t.productDetail.notFound}</h2>
        <Link href="/products" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
          {t.productDetail.back}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-28">

        <Link href="/products" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
          <ArrowRight size={16} />
          {t.productDetail.back}
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">

          {/* صورة */}
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/30">
            <div className="relative aspect-square w-full">
              <Image src={getProductImg(product)} alt={product.name} fill className="object-cover" />
            </div>
          </div>

          {/* تفاصيل */}
          <div className="flex flex-col gap-5">
            <div>
              <span className="rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {product.category}
              </span>
              <h1 className="mt-3 text-2xl font-extrabold text-foreground">{product.name}</h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {product.description || t.productDetail.defaultDesc}
              </p>
            </div>

            {/* المخزون */}
            <div className="flex items-center gap-2">
              <Package size={15} className={product.stock > 0 ? 'text-emerald-500' : 'text-destructive'} />
              <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-destructive'}`}>
                {product.stock > 0 ? `${t.productDetail.inStock} (${product.stock})` : t.productDetail.outOfStock}
              </span>
            </div>

            {/* Purchase card */}
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.productDetail.price}</span>
                <span className="text-3xl font-black text-foreground">₪{product.price}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.productDetail.quantity}</span>
                <div className="flex items-center overflow-hidden rounded-xl border border-border/70 bg-muted/40">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="flex h-10 w-10 items-center justify-center transition hover:bg-foreground/5">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold tabular-nums">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={product.stock === 0}
                    className="flex h-10 w-10 items-center justify-center transition hover:bg-foreground/5 disabled:opacity-40">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-shine w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-extrabold text-primary-foreground shadow-md transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart size={17} />
                {product.stock === 0 ? t.product.outOfStock : t.productDetail.addToCart}
              </button>
            </div>

            <RatingSection productId={product._id} currentRating={product.averageRating ?? 0} />
          </div>
        </div>

        <SimilarProducts productId={product._id} />

      </main>
    </div>
  );
}