'use client';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin } = useSelector((s: RootState) => s.auth);
  const router = useRouter();
  useEffect(() => { if (!admin) router.push('/login'); }, [admin, router]);
  if (!admin) return null;
  return <>{children}</>;
}
