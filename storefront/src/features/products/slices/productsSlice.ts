import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  image?: string;
  images?: string[];
  averageRating?: number;
}

interface ProductsState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
}

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (category: string | undefined, { rejectWithValue }) => {
    try {
      const url =
        category && category !== 'الكل'
          ? `/products?category=${category}`
          : '/products';
      const { data } = await api.get(url);
      return data.data.products || [];
    } catch (err) {
      return rejectWithValue(
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
          'Failed to fetch products'
      );
    }
  }
);
export const fetchProduct = createAsyncThunk(
  'products/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
          'Failed to fetch product'
      );
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    loading: false,
    error: null,
  } as ProductsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.product = null; // امسح المنتج القديم عشان ما يطلع بيانات غلط
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productsSlice.reducer;