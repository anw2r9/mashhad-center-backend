import type { Category, Product } from './types';
import api from './axios';

/* صورة افتراضية حسب الـ category */
const categoryFallback: Record<string, string> = {
  cement:   '/images/products/cement.png',
  steel:    '/images/products/steel.png',
  blocks:   '/images/products/blocks.png',
  sand:     '/images/products/sand.png',
  gravel:   '/images/products/gravel.png',
  tools:    '/images/products/tools.png',
  paint:    '/images/products/paint.png',
  plumbing: '/images/products/plumbing.png',
};

function getProductImage(p: any): string {
  // لو عنده صورة مرفوعة استخدمها
  if (p.images?.length) return p.images[0];
  // وإلا استخدم الصورة الافتراضية للـ category
  return categoryFallback[p.category] ?? '/images/products/cement.png';
}

function mapProduct(p: any): Product {
  return {
    id: p._id,
    name: { he: p.name, ar: p.name },
    categorySlug: p.category,
    price: p.price,
    unit: { he: 'ליחידה', ar: 'للقطعة' },
    image: getProductImage(p),
    stock: p.stock,
    rating: p.averageRating ?? undefined,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const categories = [
    { id: 'c1', slug: 'cement',   name: { he: 'מלט ובטון',   ar: 'اسمنت وخرسانة' }, icon: 'Layers' },
    { id: 'c2', slug: 'steel',    name: { he: 'ברזל',         ar: 'حديد' },           icon: 'Bolt' },
    { id: 'c3', slug: 'blocks',   name: { he: 'בלוקים',       ar: 'بلوك' },           icon: 'Blocks' },
    { id: 'c4', slug: 'sand',     name: { he: 'חול',           ar: 'رمل' },            icon: 'Mountain' },
    { id: 'c5', slug: 'gravel',   name: { he: 'חצץ',           ar: 'حصى' },            icon: 'Pickaxe' },
    { id: 'c6', slug: 'tools',    name: { he: 'כלי עבודה',   ar: 'أدوات' },          icon: 'Wrench' },
    { id: 'c7', slug: 'paint',    name: { he: 'צבע',           ar: 'دهان' },           icon: 'PaintRoller' },
    { id: 'c8', slug: 'plumbing', name: { he: 'אינסטלציה',   ar: 'سباكة' },          icon: 'Pipette' },
  ];

  try {
    const { data } = await api.get('/products');
    const products = data.data.products || [];
    return categories.map(cat => ({
      ...cat,
      count: products.filter((p: any) => p.category === cat.slug).length,
    }));
  } catch {
    return categories.map(cat => ({ ...cat, count: 0 }));
  }
}

export async function fetchProducts(category?: string): Promise<Product[]> {
  try {
    const url = category ? `/products?category=${category}` : '/products';
    const { data } = await api.get(url);
    return (data.data.products || []).map(mapProduct);
  } catch {
    return [];
  }
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const { data } = await api.get('/products');
    return (data.data.products || []).map(mapProduct);
  } catch {
    return [];
  }
}
