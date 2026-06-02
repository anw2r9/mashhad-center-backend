'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../../../../features/orders/ordersSlice';
import { AppDispatch, RootState } from '../../../../store/store';
import { toast } from 'react-toastify';
import { useLang } from '../../../../lib/lang';

// ============ shadcn components ============
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

// ============ Status config ============
const statusStyles: Record<string, { bg: string; color: string }> = {
  pending:   { bg: 'rgba(247,201,72,0.15)',  color: '#F7C948' },
  paid:      { bg: 'rgba(34,197,94,0.15)',   color: '#22c55e' },
  shipped:   { bg: 'rgba(59,130,246,0.15)',  color: '#3b82f6' },
  delivered: { bg: 'rgba(34,197,94,0.15)',   color: '#22c55e' },
  cancelled: { bg: 'rgba(239,68,68,0.15)',   color: '#ef4444' },
};

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading } = useSelector((s: RootState) => s.orders);
  const list = Array.isArray(orders) ? orders : [];
  const { t, lang } = useLang();

  useEffect(() => { dispatch(fetchOrders()); }, [dispatch]);

  // Status labels — bilingual
  const statusLabels: Record<string, string> = {
    pending:   t('قيد الانتظار', 'ממתין'),
    paid:      t('مدفوع',        'שולם'),
    shipped:   t('تم الشحن',    'נשלח'),
    delivered: t('تم التوصيل',  'נמסר'),
    cancelled: t('ملغي',        'בוטל'),
  };

  const handleStatus = async (id: string, status: string) => {
    const r = await dispatch(updateOrderStatus({ id, status }));
    if (updateOrderStatus.fulfilled.match(r)) {
      toast.success(t('تم تحديث الحالة ✅', 'הסטטוס עודכן ✅'));
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', direction: 'rtl' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff' }}>
          {t('إدارة الطلبات', 'ניהול הזמנות')}
        </h1>
        <p style={{ color: '#555', fontSize: '13px', marginTop: '4px' }}>
          {list.length} {t('طلب', 'הזמנות')}
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <p style={{ color: '#555' }}>{t('جاري التحميل...', 'טוען...')}</p>
      ) : (
        <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '18px', overflow: 'hidden' }}>

          {/* shadcn Table */}
          <Table>
            <TableHeader style={{ background: 'rgba(255,255,255,0.03)' }}>
              <TableRow style={{ borderBottom: '1px solid #1a1a1a' }}>
                {[
                  t('العميل',  'לקוח'),
                  t('المجموع', 'סה"כ'),
                  t('الحالة',  'סטטוס'),
                  t('التاريخ', 'תאריך'),
                  t('تحديث',   'עדכון'),
                ].map(h => (
                  <TableHead key={h} style={{ color: '#666', fontWeight: 500, textAlign: 'right' }}>
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {list.map((o) => {
                const status = (o as any).orderStatus || 'pending';
                const st = statusStyles[status] || statusStyles.pending;

                return (
                  <TableRow key={o._id} style={{ borderTop: '1px solid #1a1a1a' }}>

                    {/* Customer */}
                    <TableCell style={{ padding: '14px 16px' }}>
                      <p style={{ color: '#fff', fontWeight: 500 }}>
                        {o.user?.name || t('مستخدم', 'משתמש')}
                      </p>
                      <p style={{ color: '#555', fontSize: '11px' }}>{o.user?.email}</p>
                    </TableCell>

                    {/* Total */}
                    <TableCell style={{ padding: '14px 16px', color: '#F7C948', fontWeight: 700 }}>
                      ₪{o.totalPrice}
                    </TableCell>

                    {/* Status — shadcn Badge */}
                    <TableCell style={{ padding: '14px 16px' }}>
                      <Badge style={{
                        background: st.bg,
                        color: st.color,
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 500,
                      }}>
                        {statusLabels[status] || statusLabels.pending}
                      </Badge>
                    </TableCell>

                    {/* Date */}
                    <TableCell style={{ padding: '14px 16px', color: '#555', fontSize: '12px' }}>
                      {new Date(o.createdAt).toLocaleDateString(lang === 'ar' ? 'ar' : 'he')}
                    </TableCell>

                    {/* Update Status — shadcn DropdownMenu */}
                    <TableCell style={{ padding: '14px 16px' }}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            style={{
                              background: '#1a1a1a',
                              border: '1px solid #2a2a2a',
                              color: '#888',
                              borderRadius: '9px',
                              fontSize: '12px',
                              gap: '6px',
                            }}
                          >
                            {t('تحديث', 'עדכן')}
                            <ChevronDown size={12} />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          style={{
                            background: '#111',
                            border: '1px solid #222',
                            borderRadius: '12px',
                            minWidth: '140px',
                          }}
                        >
                          {[
                            { value: 'paid',      ar: 'مدفوع',       he: 'שולם',   color: '#22c55e' },
                            { value: 'shipped',   ar: 'تم الشحن',   he: 'נשלח',   color: '#3b82f6' },
                            { value: 'delivered', ar: 'تم التوصيل', he: 'נמסר',   color: '#22c55e' },
                            { value: 'cancelled', ar: 'إلغاء',       he: 'ביטול',  color: '#ef4444' },
                          ].map(item => (
                            <DropdownMenuItem
                              key={item.value}
                              onClick={() => handleStatus(o._id, item.value)}
                              style={{
                                color: item.color,
                                cursor: 'pointer',
                                borderRadius: '8px',
                                fontSize: '13px',
                              }}
                            >
                              {lang === 'ar' ? item.ar : item.he}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>

                  </TableRow>
                );
              })}

              {list.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#555' }}>
                    {t('لا يوجد طلبات', 'אין הזמנות')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

        </div>
      )}
    </div>
  );
}