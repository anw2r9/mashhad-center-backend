'use client';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../features/profile/slices/profileSlice';
import { AppDispatch, RootState } from '../../store/store';
import { Navbar } from '@/components/site/navbar';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import { Package, Clock, CheckCircle, XCircle, Truck, User, Lock, Save, Eye, EyeOff } from 'lucide-react';
import api from '../../lib/axios';
import { useStore } from '@/components/store-provider';
import { io } from 'socket.io-client';

type Tab = 'orders' | 'edit' | 'password';

function ProfileContent() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useStore();
  const { user } = useSelector((s: RootState) => s.auth);
  const { orders: rawOrders, loading } = useSelector((s: RootState) => s.profile);
  const orders = Array.isArray(rawOrders) ? rawOrders : (rawOrders as any)?.orders || [];
  
  const socketRef = useRef<any>(null);

  const [tab, setTab] = useState<Tab>('orders');
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [passLoading, setPassLoading] = useState(false);
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  // تحميل الطلبات عند الدخول
  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    dispatch(fetchMyOrders());
    setEditForm({
      name: (user as any).name || '',
      email: (user as any).email || '',
    });
  }, [user, dispatch, router]);

  // Socket.io — استقبال تحديثات الطلبات realtime
  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000',
      { transports: ['websocket'] }
    );

    socketRef.current = socket;

    socket.on('order-updated', () => {
      dispatch(fetchMyOrders());
    });

    return () => { socket.disconnect(); };
  }, [dispatch]);

  if (!user) return null;

  const statusConfig: Record<string, { icon: any; color: string }> = {
    pending:   { icon: Clock,       color: 'text-yellow-500 bg-yellow-500/10' },
    paid:      { icon: CheckCircle, color: 'text-green-500 bg-green-500/10' },
    shipped:   { icon: Truck,       color: 'text-blue-500 bg-blue-500/10' },
    delivered: { icon: CheckCircle, color: 'text-green-500 bg-green-500/10' },
    cancelled: { icon: XCircle,     color: 'text-red-500 bg-red-500/10' },
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await api.put('/users/profile', { name: editForm.name });
      toast.success(t.profile.updatedSuccess);
    } catch (err: any) {
      toast.error(err.response?.data?.message || t.profile.error);
    } finally {
      setEditLoading(false);
    }
  };

  const handlePassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirm) {
      toast.error(t.profile.passwordNoMatch);
      return;
    }
    if (passForm.newPassword.length < 8) {
      toast.error(t.profile.passwordMin);
      return;
    }
    setPassLoading(true);
    try {
      await api.put('/users/change-password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      toast.success(t.profile.passwordSuccess);
      setPassForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || t.profile.passwordError);
    } finally {
      setPassLoading(false);
    }
  };

  const tabStyle = (active: boolean) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
      active
        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
    }`;

  const inputClass = "w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10">

        {/* User Card */}
        <div className="glass rounded-3xl p-6 mb-6 flex items-center gap-5">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground text-2xl font-bold shrink-0">
            {(user as any).name?.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{(user as any).name}</h1>
            <p className="text-muted-foreground text-sm">{(user as any).email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button onClick={() => setTab('orders')} className={tabStyle(tab === 'orders')}>
            <Package size={16} />
            {t.profile.orders}
          </button>
          <button onClick={() => setTab('edit')} className={tabStyle(tab === 'edit')}>
            <User size={16} />
            {t.profile.editProfile}
          </button>
          <button onClick={() => setTab('password')} className={tabStyle(tab === 'password')}>
            <Lock size={16} />
            {t.profile.changePassword}
          </button>
        </div>

        {/* TAB: ORDERS */}
        {tab === 'orders' && (
          <>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl h-32 animate-pulse" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="glass rounded-3xl p-16 text-center">
                <Package className="mx-auto text-muted-foreground mb-4" size={48} />
                <p className="text-muted-foreground">{t.profile.noOrders}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => {
                  const statusKey = order.orderStatus || 'pending';
                  const st = statusConfig[statusKey] || statusConfig.pending;
                  const StatusIcon = st.icon;
                  const statusLabel = t.profile.status[statusKey as keyof typeof t.profile.status] || statusKey;
                  return (
                    <div key={order._id} className="glass rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t.profile.orderNumber}</p>
                          <p className="font-mono text-sm text-foreground">{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${st.color}`}>
                          <StatusIcon size={13} />
                          {statusLabel}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between text-sm text-muted-foreground">
                            <span>{item.product?.name} × {item.quantity}</span>
                            <span>₪{item.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-border/50 pt-3">
                        <span className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="font-bold text-foreground">₪{order.totalPrice}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* TAB: EDIT PROFILE */}
        {tab === 'edit' && (
          <div className="glass rounded-3xl p-8">
            <h2 className="text-lg font-bold text-foreground mb-6">{t.profile.editProfile}</h2>
            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t.profile.fullName}</label>
                <input type="text" value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t.profile.email}</label>
                <input type="email" value={editForm.email}
                  className={`${inputClass} opacity-50 cursor-not-allowed`} disabled />
                <p className="text-xs text-muted-foreground mt-1">{t.profile.emailReadonly}</p>
              </div>
              <button type="submit" disabled={editLoading}
                className="flex items-center gap-2 bg-primary text-primary-foreground rounded-2xl px-8 py-3 font-bold text-sm transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/25">
                <Save size={16} />
                {editLoading ? t.profile.saving : t.profile.saveChanges}
              </button>
            </form>
          </div>
        )}

        {/* TAB: CHANGE PASSWORD */}
        {tab === 'password' && (
          <div className="glass rounded-3xl p-8">
            <h2 className="text-lg font-bold text-foreground mb-6">{t.profile.changePassword}</h2>
            <form onSubmit={handlePassSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t.profile.currentPassword}</label>
                <div className="relative">
                  <input type={showPass.current ? 'text' : 'password'} value={passForm.currentPassword}
                    onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })}
                    className={`${inputClass} pl-10`} placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPass(s => ({ ...s, current: !s.current }))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition">
                    {showPass.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t.profile.newPassword}</label>
                <div className="relative">
                  <input type={showPass.new ? 'text' : 'password'} value={passForm.newPassword}
                    onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })}
                    className={`${inputClass} pl-10`} placeholder="••••••••" required minLength={8} />
                  <button type="button" onClick={() => setShowPass(s => ({ ...s, new: !s.new }))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition">
                    {showPass.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t.profile.passwordMin}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t.profile.confirmPassword}</label>
                <div className="relative">
                  <input type={showPass.confirm ? 'text' : 'password'} value={passForm.confirm}
                    onChange={e => setPassForm({ ...passForm, confirm: e.target.value })}
                    className={`${inputClass} pl-10`} placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPass(s => ({ ...s, confirm: !s.confirm }))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition">
                    {showPass.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passForm.confirm && (
                  <p className={`text-xs mt-1 ${passForm.newPassword === passForm.confirm ? 'text-green-500' : 'text-destructive'}`}>
                    {passForm.newPassword === passForm.confirm ? t.profile.passwordMatch : t.profile.passwordNoMatch}
                  </p>
                )}
              </div>
              <button type="submit" disabled={passLoading}
                className="flex items-center gap-2 bg-primary text-primary-foreground rounded-2xl px-8 py-3 font-bold text-sm transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/25">
                <Lock size={16} />
                {passLoading ? t.profile.saving : t.profile.changePasswordBtn}
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}

export default function ProfilePage() {
  const pathname = usePathname();
  return <ProfileContent key={pathname} />;
}