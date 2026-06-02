import { MetadataRoute } from 'next';
import api from '../lib/axios';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: any[] = [];

  try {
    const { data } = await api.get('/products');
    products = data.data.products || [];
  } catch {
    products = [];
  }

  const productUrls = products.map((product) => ({
    url: `http://localhost:3001/products/${product._id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: 'http://localhost:3001', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'http://localhost:3001/products', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'http://localhost:3001/login', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'http://localhost:3001/register', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...productUrls,
  ];
}