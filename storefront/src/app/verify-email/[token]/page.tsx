'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HardHat, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../../lib/axios';

export default function VerifyEmailPage({ params }: { params: { token: string } }) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    api.get(`/auth/verify-email/${params.token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [params.token]);

  return (
    <div className="min-h-screen bg-background ambient-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <HardHat className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">משהד סנטר</h1>
        </div>

        <div className="glass rounded-3xl p-8 text-center">

          {/* Loading */}
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <h2 className="text-lg font-bold text-foreground mb-2">
                מאמת... | جاري التحقق...
              </h2>
              <p className="text-sm text-muted-foreground">
                אנא המתן | يرجى الانتظار
              </p>
            </>
          )}

          {/* Success */}
          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-2">
                האימייל אומת! | تم التحقق!
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                החשבון שלך אומת בהצלחה | تم التحقق من حسابك بنجاح
              </p>
              <Link
                href="/login"
                className="inline-block bg-primary text-primary-foreground rounded-2xl px-8 py-3 font-bold text-sm transition hover:scale-[1.02] shadow-lg shadow-primary/25"
              >
                התחבר עכשיו | سجّل الدخول الآن
              </Link>
            </>
          )}

          {/* Error */}
          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-2">
                הקישור לא תקין | الرابط غير صالح
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                הקישור פג תוקף או אינו תקין | الرابط منتهي الصلاحية أو غير صحيح
              </p>
              <Link
                href="/login"
                className="inline-block bg-primary text-primary-foreground rounded-2xl px-8 py-3 font-bold text-sm transition hover:scale-[1.02] shadow-lg shadow-primary/25"
              >
                חזרה להתחברות | العودة لتسجيل الدخول
              </Link>
            </>
          )}

        </div>
      </div>
    </div>
  );
}