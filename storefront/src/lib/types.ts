export type Locale = 'he' | 'ar'

export interface LocalizedText {
  he: string
  ar: string
}

export interface Category {
  id: string
  slug: string
  name: LocalizedText
  icon: string
  count: number
}

export interface Product {
  id: string
  name: LocalizedText
  categorySlug: string
  price: number
  unit: LocalizedText
  image: string
  stock: number
  badge?: LocalizedText
  rating?: number
}

export interface CartLine {
  product: Product
  quantity: number
}
