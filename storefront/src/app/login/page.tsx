'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/auth/slices/authSlice';
import { AppDispatch, RootState } from '../../store/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { HardHat, Mail, Lock, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading } = useSelector((s: RootState) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      toast.success('ברוך הבא! | مرحباً ✅');
      router.push('/');
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <div className="min-h-screen bg-background ambient-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <HardHat className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">משהד סנטר</h1>
          <p className="text-muted-foreground text-sm mt-1">התחבר לחשבונך | سجّل دخولك</p>
        </div>

        <div className="glass rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                דואר אלקטרוני | البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-foreground">
                  סיסמה | كلمة المرور
                </label>
                {/* ← رابط نسيت كلمة المرور */}
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  שכחת סיסמה? | نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground rounded-2xl py-3.5 font-bold text-sm transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/25"
            >
              {loading ? 'מתחבר... | جاري الدخول...' : 'התחבר | تسجيل الدخول'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              אין לך חשבון? | ليس لديك حساب؟{' '}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                הירשם | سجّل الآن
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="w-4 h-4" />
            חזרה לחנות | العودة للمتجر
          </Link>
        </div>
      </div>
    </div>
  );
}