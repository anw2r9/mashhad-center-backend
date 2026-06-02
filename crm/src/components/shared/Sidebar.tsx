'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { AppDispatch } from '../../store/store';
import { useLang } from '../../lib/lang';
import { LayoutDashboard, Package, Users, ShoppingCart, LogOut, BarChart3, HelpCircle } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { t } = useLang();

  const links = [
    { href: '/dashboard', label: t('الرئيسية', 'ראשי'), icon: LayoutDashboard },
    { href: '/dashboard/orders', label: t('الطلبات', 'הזמנות'), icon: ShoppingCart },
    { href: '/dashboard/products', label: t('المنتجات', 'מוצרים'), icon: Package },
    { href: '/dashboard/users', label: t('المستخدمين', 'משתמשים'), icon: Users },
  ];

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const getLinkStyle = (active: boolean) => ({
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '11px 14px', borderRadius: '12px',
    fontSize: '14px', cursor: 'pointer', marginBottom: '3px',
    textDecoration: 'none', transition: 'all 0.2s',
    background: active ? 'linear-gradient(135deg, #F7C948, #e6a800)' : 'transparent',
    color: active ? '#1a1a1a' : '#888',
    fontWeight: active ? 600 : 400,
    boxShadow: active ? '0 0 20px rgba(247,201,72,0.35)' : 'none',
  });

  return (
    <aside style={{ width: '240px', minHeight: '100vh', background: '#0d0d0d', borderLeft: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', padding: '1.25rem', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', marginBottom: '1.5rem' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg, #F7C948, #e6a800)', boxShadow: '0 0 16px rgba(247,201,72,0.4)' }} />
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>משהד סנטר</span>
      </div>

      {/* Links */}
      <nav>
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} style={getLinkStyle(pathname === href)}>
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div style={{ height: '1px', background: '#1a1a1a', margin: '1rem 0' }} />
      <p style={{ fontSize: '11px', color: '#555', padding: '0 12px', marginBottom: '6px' }}>
        {t('إدارة', 'ניהול')}
      </p>

      <nav>
        {[
          { icon: BarChart3, ar: 'التحليلات', he: 'אנליטיקה' },
          { icon: HelpCircle, ar: 'المساعدة', he: 'עזרה' },
        ].map(({ icon: Icon, ar, he }) => (
          <div key={ar} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '12px', color: '#666', fontSize: '14px', cursor: 'pointer', marginBottom: '3px' }}>
            <Icon size={18} />
            <span>{t(ar, he)}</span>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #1a1a1a' }}>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '12px', color: '#666', fontSize: '14px', cursor: 'pointer', background: 'none', border: 'none', width: '100%' }}>
          <LogOut size={18} />
          <span>{t('تسجيل الخروج', 'יציאה')}</span>
        </button>
      </div>
    </aside>
  );
}