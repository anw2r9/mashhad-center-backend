import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';

interface AuthState {
  admin: object | null;
  requiresTwoFactor: boolean;
  pendingEmail: string | null;
  loading: boolean;
  error: string | null;
}

export const loginAdmin = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const { data } = await api.post('/auth/admin/login', credentials);
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const verifyTwoFactor = createAsyncThunk(
  'auth/verify2fa',
  async ({ email, code }: { email: string; code: string }, thunkAPI) => {
    try {
      const { data } = await api.post('/auth/admin/verify-2fa', { email, code });
      localStorage.setItem('adminToken', data.data.token);
      localStorage.setItem('adminData', JSON.stringify(data.data.user));
      return data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Invalid code');
    }
  }
);

// جلب الـ admin من localStorage عند التحميل
const adminFromStorage = typeof window !== 'undefined'
  ? localStorage.getItem('adminData')
  : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    admin: adminFromStorage ? JSON.parse(adminFromStorage) : null,
    requiresTwoFactor: false,
    pendingEmail: null,
    loading: false,
    error: null,
  } as AuthState,
  reducers: {
    logout: (state) => {
      state.admin = null;
      state.requiresTwoFactor = false;
      state.pendingEmail = null;
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.requiresTwoFactor = true;
        state.pendingEmail = action.meta.arg.email;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyTwoFactor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyTwoFactor.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.user;
        state.requiresTwoFactor = false;
        state.pendingEmail = null;
      })
      .addCase(verifyTwoFactor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;