'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/site/navbar';
import { formatPrice, useStore } from '@/components/store-provider';
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { t, locale, lines, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useStore();

  // اسم المنتج حسب اللغة
  const getName = (name: any) =>
    typeof name === 'object' ? name[locale] : name;

  /* Empty state */
  if (lines.length === 0) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 py-40 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <ShoppingBag className="h-9 w-9" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-foreground">{t.cart.empty}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.cart.emptyDesc}</p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md transition hover:brightness-110"
        >
          {t.cart.shopNow}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-28">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">{t.cart.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {cartCount} {cartCount === 1 ? t.cart.item : t.cart.items}
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowRight className="h-4 w-4" />
            {t.cart.continueShopping}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Cart items */}
          <div className="space-y-3 lg:col-span-2">
            {lines.map((line) => (
              <div
                key={line.product.id}
                className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={line.product.image || '/images/products/cement.png'}
                    alt={getName(line.product.name)}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-bold text-foreground">{getName(line.product.name)}</h3>
                  <p className="mt-1 text-sm font-semibold text-primary">{formatPrice(line.product.price)}</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center overflow-hidden rounded-xl border border-border/70 bg-muted/40">
                  <button
                    onClick={() => updateQuantity(line.product.id, line.quantity - 1)}
                    className="flex h-9 w-9 items-center justify-center text-foreground transition hover:bg-foreground/5"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold tabular-nums">{line.quantity}</span>
                  <button
                    onClick={() => updateQuantity(line.product.id, line.quantity + 1)}
                    className="flex h-9 w-9 items-center justify-center text-foreground transition hover:bg-foreground/5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden w-20 text-end text-sm font-bold text-foreground sm:block">
                    {formatPrice(line.product.price * line.quantity)}
                  </span>
                  <button
                    onClick={() => removeFromCart(line.product.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="mt-2 text-sm text-muted-foreground underline-offset-2 transition hover:text-destructive hover:underline"
            >
              {t.cart.clearCart}
            </button>
          </div>

          {/* Order summary */}
          <div className="h-fit rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-foreground">{t.cart.summary}</h2>

            <div className="divider my-4" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{t.cart.subtotal} ({cartCount})</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t.cart.shipping}</span>
                <span className="text-emerald-600">{t.cart.shippingFree}</span>
              </div>
            </div>

            <div className="divider my-4" />

            <div className="flex justify-between text-base font-black text-foreground">
              <span>{t.cart.total}</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>

            <Link
              href="/checkout"
              className="btn-shine mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-extrabold text-primary-foreground shadow-md transition hover:brightness-110 active:scale-95"
            >
              {t.cart.checkout}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}