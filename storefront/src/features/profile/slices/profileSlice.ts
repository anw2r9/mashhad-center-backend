import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';

interface Order {
  _id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: { product: { name: string; image: string }; quantity: number; price: number }[];
}

interface ProfileState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

// جلب طلبات المستخدم
export const fetchMyOrders = createAsyncThunk(
  'profile/fetchOrders',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get('/orders/my-orders');
      return data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// تحديث بيانات المستخدم
export const updateProfile = createAsyncThunk(
  'profile/update',
  async (userData: { name?: string; email?: string; password?: string }, thunkAPI) => {
    try {
      const { data } = await api.put('/users/me', userData);
      localStorage.setItem('userData', JSON.stringify(data.data));
      return data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update profile');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  } as ProfileState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = Array.isArray(action.payload) 
  ? action.payload 
  : action.payload?.orders || [];
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;