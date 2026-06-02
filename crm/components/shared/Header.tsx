'use client';
import { useSelector } from 'react-redux';
import { RootState } from '../../src/store/store';

export default function Header() {
  const { admin } = useSelector((s: RootState) => s.auth);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <h2 className="text-slate-700 font-semibold text-lg">لوحة الإدارة</h2>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm font-bold">
          A
        </div>
        <span className="text-slate-600 text-sm">
          {(admin as any)?.name || 'Admin'}
        </span>
      </div>
    </header>
  );
}