import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';

interface Order {
  _id: string;
  user: { name: string; email: string };
  totalPrice: number;
  status: string;
  createdAt: string;
  items: { product: { name: string }; quantity: number }[];
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get('/orders');
      return data.data.orders || [];
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }: { id: string; status: string }, thunkAPI) => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status }); // ← صحح هون
      return data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update order');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  } as OrdersState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) state.orders[index] = action.payload;
      });
  },
});

export default ordersSlice.reducer;