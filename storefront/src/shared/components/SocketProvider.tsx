'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { fetchProducts } from '../../features/products/slices/productsSlice';
import socket from '../../lib/socket';

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // الاتصال بالـ Socket
    socket.connect();

    // لما منتج جديد ينضاف — حدّث قائمة المنتجات
    socket.on('product-created', () => {
      dispatch(fetchProducts());
    });

    // لما المخزون يتغير
    socket.on('stock-updated', () => {
      dispatch(fetchProducts());
    });

    return () => {
      socket.off('product-created');
      socket.off('stock-updated');
      socket.disconnect();
    };
  }, [dispatch]);

  return <>{children}</>;
}