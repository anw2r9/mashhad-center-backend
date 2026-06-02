import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}

interface DashboardState {
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
}

export const fetchStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, thunkAPI) => {
    try {
      const [products, users, orders] = await Promise.all([
        api.get('/products'),
        api.get('/users'),
        api.get('/orders'),
      ]);

      const ordersList = orders.data.data.orders || [];
      const totalRevenue = ordersList.reduce(
        (sum: number, order: any) => sum + (order.totalPrice || 0), 0
      );

      return {
        totalProducts: products.data.data.totalCount || 0,
        totalUsers: users.data.data.totalCount || 0,
        totalOrders: orders.data.data.totalCount || 0,
        totalRevenue,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: { totalProducts: 0, totalUsers: 0, totalOrders: 0, totalRevenue: 0 },
    loading: false,
    error: null,
  } as DashboardState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;