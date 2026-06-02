'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin, verifyTwoFactor } from '../../../features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '../../../store/store';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, requiresTwoFactor, pendingEmail } = useSelector((s: RootState) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [twoFACode, setTwoFACode] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginAdmin(form));
    if (loginAdmin.rejected.match(result)) toast.error(result.payload as string);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(verifyTwoFactor({ email: pendingEmail!, code: twoFACode }));
    if (verifyTwoFactor.fulfilled.match(result)) {
      toast.success('ברוך הבא! ✅');
      router.push('/dashboard');
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: 'system-ui, sans-serif',
      direction: 'rtl',
    }}>
      {/* Grid Pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(247,201,72,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(247,201,72,0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      {/* Glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(247,201,72,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '72px', height: '72px',
            background: 'linear-gradient(135deg, #F7C948, #e6b800)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 32px rgba(247,201,72,0.3)',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: '700', margin: '0 0 4px' }}>
            משהד סנטר
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            {requiresTwoFactor ? 'אימות דו-שלבי | التحقق الثنائي' : 'לוח ניהול | لوحة الإدارة'}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '2rem',
          backdropFilter: 'blur(20px)',
        }}>
          {!requiresTwoFactor ? (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '8px' }}>
                  דואר אלקטרוני | البريد الإلكتروني
                </label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange} required
                  placeholder="admin@store.com"
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                    padding: '12px 16px', color: '#fff', fontSize: '14px',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '8px' }}>
                  סיסמה | كلمة المرور
                </label>
                <input
                  type="password" name="password" value={form.password} onChange={handleChange} required
                  placeholder="••••••••"
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                    padding: '12px 16px', color: '#fff', fontSize: '14px',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%',
                background: loading ? 'rgba(247,201,72,0.5)' : 'linear-gradient(135deg, #F7C948, #e6b800)',
                color: '#1a1a1a', border: 'none', borderRadius: '14px',
                padding: '14px', fontSize: '15px', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(247,201,72,0.3)',
                transition: 'transform 0.2s',
              }}>
                {loading ? 'מתחבר... | جاري الدخول...' : 'התחבר | تسجيل الدخول'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '52px', height: '52px',
                  background: 'rgba(247,201,72,0.1)',
                  borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F7C948" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                  נשלח קוד לאימייל | تم إرسال كود التحقق
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '8px', textAlign: 'center' }}>
                  קוד אימות | كود التحقق
                </label>
                <input
                  type="text" maxLength={6} value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)} required
                  placeholder="000000"
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(247,201,72,0.3)', borderRadius: '12px',
                    padding: '14px 16px', color: '#F7C948', fontSize: '24px',
                    fontWeight: '700', textAlign: 'center', letterSpacing: '8px',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%',
                background: 'linear-gradient(135deg, #F7C948, #e6b800)',
                color: '#1a1a1a', border: 'none', borderRadius: '14px',
                padding: '14px', fontSize: '15px', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(247,201,72,0.3)',
              }}>
                {loading ? 'מאמת... | جاري التحقق...' : 'אמת | تأكيد'}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '1.5rem' }}>
          © 2025 משהד סנטר — כל הזכויות שמורות
        </p>
      </div>
    </div>
  );
}