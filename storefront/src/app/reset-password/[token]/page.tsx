'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { HardHat, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../../../lib/axios';

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('הסיסמאות אינן תואמות | كلمات المرور غير متطابقة');
      return;
    }
    if (form.password.length < 8) {
      toast.error('הסיסמה חייבת להכיל לפחות 8 תווים | كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${params.token}`, { password: form.password });
      setDone(true);
      toast.success('הסיסמה אופסה בהצלחה! | تم إعادة تعيين كلمة المرور ✅');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'הקישור פג תוקף | الرابط منتهي الصلاحية');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background ambient-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <HardHat className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">משהד סנטר</h1>
          <p className="text-muted-foreground text-sm mt-1">
            איפוס סיסמה | إعادة تعيين كلمة المرور
          </p>
        </div>

        <div className="glass rounded-3xl p-8">
          {!done ? (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  סיסמה חדשה | كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  לפחות 8 תווים | 8 أحرف على الأقل
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  אימות סיסמה | تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={form.confirm}
                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {/* Match indicator */}
                {form.confirm && (
                  <p className={`text-xs mt-1 ${form.password === form.confirm ? 'text-green-500' : 'text-destructive'}`}>
                    {form.password === form.confirm
                      ? '✓ הסיסמאות תואמות | كلمات المرور متطابقة'
                      : '✗ הסיסמאות אינן תואמות | كلمات المرور غير متطابقة'
                    }
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground rounded-2xl py-3.5 font-bold text-sm transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/25"
              >
                {loading ? 'שומר... | جاري الحفظ...' : 'אפס סיסמה | إعادة التعيين'}
              </button>
            </form>
          ) : (
            /* Success */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-2">
                הסיסמה אופסה! | تم إعادة التعيين!
              </h2>
              <p className="text-sm text-muted-foreground">
                מועבר לדף ההתחברות... | جاري التحويل لصفحة الدخول...
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition">
              חזרה להתחברות | العودة لتسجيل الدخول
            </Link>
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