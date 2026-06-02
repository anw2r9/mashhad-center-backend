'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { logout } from '../../features/auth/slices/authSlice';
import { ShoppingCart, User, LogOut, Store } from 'lucide-react';

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((s: RootState) => s.auth);
  const { items } = useSelector((s: RootState) => s.cart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800">
          <Store size={24} />
          متجرنا
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/products" className="text-slate-600 hover:text-slate-900">
            المنتجات
          </Link>

          <Link href="/cart" className="relative text-slate-600 hover:text-slate-900">
            <ShoppingCart size={22} />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {mounted && user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-1 text-slate-600 hover:text-slate-800">
                <User size={20} />
                <span className="text-sm hidden sm:inline">{(user as any).name}</span>
              </Link>
              <button onClick={() => dispatch(logout())} className="text-slate-600 hover:text-red-500">
                <LogOut size={22} />
              </button>
            </div>
          ) : mounted ? (
            <Link href="/login" className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700">
              تسجيل الدخول
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}