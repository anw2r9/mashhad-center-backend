import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';
import { syncCartWithDB } from '../../cart/slices/cartSlice';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, thunkAPI) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('userToken', data.data.token);
      localStorage.setItem('userData', JSON.stringify(data.data.user));
      // سنكرون العربة بعد التسجيل
      await thunkAPI.dispatch(syncCartWithDB());
      return data.data.user;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('userToken', data.data.token);
      localStorage.setItem('userData', JSON.stringify(data.data.user));
      // سنكرون العربة بعد تسجيل الدخول
      await thunkAPI.dispatch(syncCartWithDB());
      return data.data.user;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

const userFromStorage = typeof window !== 'undefined'
  ? localStorage.getItem('userData')
  : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
    loading: false,
    error: null,
  } as AuthState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('mashhad_cart');
      localStorage.removeItem('mashhad_locale');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer;