'use client';
import { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, AppDispatch, RootState } from '../store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SocketProvider from '../shared/components/SocketProvider';
import { fetchProducts } from '../features/products/slices/productsSlice';
import { setUser } from '../features/auth/slices/authSlice';

/* يحمّل المنتجات مرة واحدة عند بدء التطبيق */
function ProductsLoader() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  return null;
}

/* يحمّل الـ auth من localStorage عند بدء التطبيق */
function AuthLoader() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    // إذا الـ user موجود بـ Redux، ما نحتاج نحمّل من localStorage
    if (user) return;

    // حمّل من localStorage
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const { user: userData } = JSON.parse(storedAuth);
        if (userData) {
          dispatch(setUser(userData));
        }
      } catch (err) {
        console.error('Failed to load auth from localStorage:', err);
      }
    }
  }, [dispatch, user]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ProductsLoader />
      <AuthLoader />
      <SocketProvider>
        {children}
        <ToastContainer position="top-right" rtl />
      </SocketProvider>
    </Provider>
  );
}