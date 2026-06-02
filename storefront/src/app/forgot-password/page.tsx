'use client';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { HardHat, Mail, ArrowLeft, Send } from 'lucide-react';
import api from '../../lib/axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('הקישור נשלח! | تم إرسال الرابط ✅');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'שגיאה | حدث خطأ');
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
            שכחת סיסמה? | نسيت كلمة المرور؟
          </p>
        </div>

        <div className="glass rounded-3xl p-8">
          {!sent ? (
            <>
              <p className="text-sm text-muted-foreground mb-6 text-center leading-relaxed">
                הזן את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה
                <br />
                أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    דואר אלקטרוני | البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-2xl py-3.5 font-bold text-sm transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/25"
                >
                  <Send size={16} />
                  {loading ? 'שולח... | جاري الإرسال...' : 'שלח קישור | إرسال الرابط'}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-2">
                הקישור נשלח! | تم الإرسال!
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                בדוק את תיבת הדואר שלך | تحقق من بريدك الإلكتروني
                <br />
                <span className="text-primary font-medium">{email}</span>
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