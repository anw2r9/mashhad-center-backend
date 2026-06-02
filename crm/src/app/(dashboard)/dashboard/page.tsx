'use client';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats } from '../../../features/dashboard/dashboardSlice';
import { fetchProducts } from '../../../features/products/productsSlice';
import { fetchOrders } from '../../../features/orders/ordersSlice';
import { AppDispatch, RootState } from '../../../store/store';
import { Package, Users, ShoppingCart, DollarSign, Wifi, WifiOff } from 'lucide-react';
import { useLang } from '../../../lib/lang';
import { io } from 'socket.io-client';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, loading } = useSelector((s: RootState) => s.dashboard);
  const { t } = useLang();
  const socketRef = useRef<any>(null);
  const [socketStatus, setSocketStatus] = useState<'connected' | 'disconnected'>('disconnected');

  useEffect(() => { dispatch(fetchStats()); }, [dispatch]);

  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000',
      { transports: ['websocket'] }
    );
  
    socketRef.current = socket;
    socket.on('connect', () => setSocketStatus('connected'));
    socket.on('disconnect', () => setSocketStatus('disconnected'));
    socket.on('order-created', () => { dispatch(fetchStats()); dispatch(fetchOrders()); });
    socket.on('product-created', () => { dispatch(fetchStats()); dispatch(fetchProducts()); });
    socket.on('stock-updated', () => { dispatch(fetchStats()); dispatch(fetchProducts()); });
  
    return () => { socket.disconnect(); };
  }, [dispatch]);

  const now = new Date();
  const monthAgo = new Date(now);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const dateRange = `${monthAgo.toLocaleDateString()} - ${now.toLocaleDateString()}`;

  const cards = [
    { title: t('المنتجات', 'מוצרים'), sub: t('إجمالي المنتجات', 'סה"כ מוצרים'), value: stats.totalProducts, icon: Package, color: '#F7C948', bg: 'rgba(247,201,72,0.15)', bars: [60, 80, 40, 90, 50, 70], glow: false },
    { title: t('المستخدمين', 'משתמשים'), sub: t('+12% هذا الشهر', '+12% החודש'), value: stats.totalUsers, icon: Users, color: '#22c55e', bg: 'rgba(34,197,94,0.15)', bars: [40, 65, 50, 75, 60, 85], glow: false },
    { title: t('الطلبات', 'הזמנות'), sub: t('طلبات جديدة', 'הזמנות חדשות'), value: stats.totalOrders, icon: ShoppingCart, color: '#a855f7', bg: 'rgba(168,85,247,0.15)', bars: [50, 70, 45, 80, 55, 90], glow: false },
    { title: t('الأرباح', 'רווח'), sub: t('+8% عن الشهر الماضي', '+8% מהחודש שעבר'), value: `₪${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#F7C948', bg: 'rgba(247,201,72,0.15)', bars: [40, 60, 100, 50, 70, 45], glow: true },
  ];

  const months = [
    t('سبتمبر', 'ספטמבר'), t('أكتوبر', 'אוקטובר'), t('نوفمبر', 'נובמבר'),
    t('ديسمبر', 'דצמבר'), t('يناير', 'ינואר'), t('فبراير', 'פברואר'), t('مارس', 'מרץ'),
  ];

  const chartBars = [30, 45, 25, 60, 40, 70, 85, 95, 75, 55, 65, 40, 50, 35];
  const card = { background: '#111', border: '1px solid #1f1f1f', borderRadius: '18px', padding: '1.25rem', transition: 'all 0.25s' };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', direction: 'rtl' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            {t('لوحة التحكم', 'לוח בקרה')}
          </h1>
          <p style={{ color: '#555', fontSize: '13px' }}>{dateRange}</p>
        </div>

        {/* Socket Status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 12px', borderRadius: '10px',
          background: socketStatus === 'connected' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${socketStatus === 'connected' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
        }}>
          {socketStatus === 'connected'
            ? <Wifi size={13} color="#22c55e" />
            : <WifiOff size={13} color="#ef4444" />
          }
          <span style={{ fontSize: '11px', fontWeight: 600, color: socketStatus === 'connected' ? '#22c55e' : '#ef4444' }}>
            {socketStatus === 'connected'
              ? t('متصل — تحديث تلقائي', 'מחובר — עדכון אוטומטי')
              : t('غير متصل', 'לא מחובר')
            }
          </span>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
          {[...Array(4)].map((_, i) => <div key={i} style={{ ...card, height: '160px', opacity: 0.6 }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
          {cards.map(({ title, sub, value, icon: Icon, color, bg, bars, glow }) => (
            <div key={title} style={{ ...card, ...(glow ? { borderColor: 'rgba(247,201,72,0.3)', boxShadow: 'inset 0 0 40px rgba(247,201,72,0.08)' } : {}) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={color} />
                </div>
                <span style={{ fontSize: '13px', color: '#888' }}>{title}</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>{value}</p>
              <p style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>{sub}</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '40px', marginTop: '12px' }}>
                {bars.map((h, idx) => {
                  const isMax = h === Math.max(...bars);
                  return <div key={idx} style={{ flex: 1, borderRadius: '2px', height: `${h}%`, background: isMax ? color : '#2a2a2a', boxShadow: isMax && glow ? `0 0 10px ${color}88` : 'none' }} />;
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div style={{ ...card, borderColor: '#1f1f1f' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'rgba(247,201,72,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={16} color="#F7C948" />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{t('إجمالي الأرباح', 'סה"כ רווח')}</span>
        </div>
        <p style={{ fontSize: '40px', fontWeight: 700, textAlign: 'center', background: 'linear-gradient(135deg, #fff, #F7C948)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px' }}>
          ₪{stats.totalRevenue.toLocaleString()}
        </p>
        <p style={{ textAlign: 'center', color: '#555', fontSize: '13px', marginBottom: '1.5rem' }}>
          +24.4% {t('عن الفترة الماضية', 'לעומת תקופה קודמת')}
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '140px', padding: '0 4px' }}>
          {chartBars.map((h, i) => {
            const isPeak = h === 95;
            const isHigh = h >= 70;
            return <div key={i} style={{ flex: 1, borderRadius: '2px 2px 0 0', height: `${h}%`, background: isPeak ? 'linear-gradient(180deg, #ff6b35, #F7C948)' : isHigh ? 'linear-gradient(180deg, #F7C948, #e6a800)' : '#2a2a2a', boxShadow: isPeak ? '0 0 16px rgba(247,201,72,0.6)' : 'none' }} />;
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          {months.map(m => <span key={m} style={{ fontSize: '11px', color: '#555' }}>{m}</span>)}
        </div>
      </div>
    </div>
  );
}