import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../lib/axios';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  syncing: boolean;
}

// سنكرون العربة مع DB لما المستخدم يسجل دخول
export const syncCartWithDB = createAsyncThunk(
  'cart/sync',
  async (_, thunkAPI) => {
    try {
      // اقرأ من mashhad_cart (useStore localStorage key)
      const raw = localStorage.getItem('mashhad_cart');
      const localLines = raw ? JSON.parse(raw) : [];

      if (localLines.length === 0) return [];

      const { data } = await api.post('/cart/sync', {
        items: localLines.map((line: any) => ({
          product: line.product.id,
          quantity: line.quantity,
        }))
      });

      // امسح العربة المحلية بعد الـ sync
      localStorage.removeItem('mashhad_cart');
      return data.data?.items || [];
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Sync failed');
    }
  }
);

// جلب العربة من DB
export const fetchCartFromDB = createAsyncThunk(
  'cart/fetchFromDB',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get('/cart');
      return data.data?.items || [];
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    syncing: false,
  } as CartState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(i => i._id === action.payload._id);
      if (existing) {
        if (existing.quantity < existing.stock) {
          existing.quantity += 1;
        }
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i._id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i._id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncCartWithDB.pending, (state) => { state.syncing = true; })
      .addCase(syncCartWithDB.fulfilled, (state, action) => {
        state.syncing = false;
        state.items = action.payload || [];
      })
      .addCase(syncCartWithDB.rejected, (state) => { state.syncing = false; })
      .addCase(fetchCartFromDB.fulfilled, (state, action) => {
        state.items = action.payload || [];
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;