'use client';
import { useState } from 'react';
import { Navbar } from '@/components/site/navbar';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { MapPin, ClipboardCheck, CreditCard, CheckCircle } from 'lucide-react';
import api from '../../lib/axios';
import { formatPrice, useStore } from '@/components/store-provider';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const steps = [
  { labelHe: 'מידע משלוח', labelAr: 'معلومات الشحن', icon: MapPin },
  { labelHe: 'סקירת הזמנה', labelAr: 'مراجعة الطلب', icon: ClipboardCheck },
  { labelHe: 'אישור תשלום', labelAr: 'تأكيد الدفع', icon: CreditCard },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { locale, lines, cartTotal, clearCart } = useStore();
  const { user } = useSelector((s: RootState) => s.auth);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', zipCode: '', country: '' });

  const label = (he: string, ar: string) => locale === 'he' ? he : ar;

  const handleOrder = async () => {
    if (!user) {
      toast.error(label('יש להתחבר תחילה', 'يجب تسجيل الدخول'));
      router.push('/login');
      return;
    }
    if (lines.length === 0) {
      toast.error(label('העגלה ריקה', 'السلة فارغة'));
      return;
    }
    setLoading(true);
    try {
      await api.post('/orders', {
        items: lines.map(line => ({
          productId: line.product.id,
          quantity: line.quantity,
        })),
        shippingAddress: address,
        paymentMethod: 'simulated',
      });
      clearCart();
      toast.success(label('ההזמנה נשלחה! 🎉', 'تم إرسال طلبك! 🎉'));
      router.push('/profile');
    } catch (err: any) {
      toast.error(err.response?.data?.message || label('שגיאה בשליחת ההזמנה', 'فشل إرسال الطلب'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-28">
        <h1 className="mb-8 text-2xl font-extrabold text-foreground">
          {label('השלמת הזמנה', 'إتمام الطلب')}
        </h1>

        {/* Steps */}
        <div className="mb-10 flex items-center justify-between">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${
                  i <= step ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}>
                  {i < step ? <CheckCircle size={18} /> : <Icon size={18} />}
                </div>
                <span className={`hidden text-xs font-medium sm:block ${i <= step ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {locale === 'he' ? s.labelHe : s.labelAr}
                </span>
                {i < steps.length - 1 && (
                  <div className={`mx-2 h-px w-8 ${i < step ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step 1 — Shipping */}
        {step === 0 && (
          <div className="glass rounded-3xl p-8 space-y-5">
            <h2 className="text-lg font-bold text-foreground">{label('מידע משלוח', 'معلومات الشحن')}</h2>
            {[
              { name: 'street',  he: 'רחוב',  ar: 'الشارع',        ph: { he: 'רחוב הרצל 1', ar: 'شارع الرئيسي 1' } },
              { name: 'city',    he: 'עיר',   ar: 'المدينة',       ph: { he: 'תל אביב',     ar: 'تل أبيب' } },
              { name: 'zipCode', he: 'מיקוד', ar: 'الرمز البريدي', ph: { he: '6100000',     ar: '6100000' } },
              { name: 'country', he: 'מדינה', ar: 'الدולة',        ph: { he: 'ישראל',       ar: 'إسرائيل' } },
            ].map(({ name, he, ar, ph }) => (
              <div key={name}>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  {locale === 'he' ? he : ar}
                </label>
                <input
                  type="text"
                  name={name}
                  value={address[name as keyof typeof address]}
                  onChange={e => setAddress({ ...address, [e.target.name]: e.target.value })}
                  placeholder={locale === 'he' ? ph.he : ph.ar}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ))}
            <button
              onClick={() => setStep(1)}
              disabled={!address.street || !address.city || !address.zipCode || !address.country}
              className="w-full rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:brightness-110 disabled:opacity-50"
            >
              {label('הבא', 'التالي')}
            </button>
          </div>
        )}

        {/* Step 2 — Review */}
        {step === 1 && (
          <div className="glass rounded-3xl p-8">
            <h2 className="mb-6 text-lg font-bold text-foreground">{label('סקירת הזמנה', 'مراجعة الطلب')}</h2>
            <div className="mb-6 space-y-3">
              {lines.map(line => {
                const name = typeof line.product.name === 'object'
                  ? line.product.name[locale]
                  : line.product.name
                return (
                  <div key={line.product.id} className="flex items-center justify-between border-b border-border/50 py-2 text-sm">
                    <span className="text-foreground">{name} × {line.quantity}</span>
                    <span className="font-semibold text-foreground">{formatPrice(line.product.price * line.quantity)}</span>
                  </div>
                )
              })}
            </div>
            <div className="mb-6 flex justify-between text-lg font-black text-foreground">
              <span>{label('סך הכל', 'الإجمالي')}</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)}
                className="flex-1 rounded-2xl border border-border py-3 text-sm font-medium text-foreground transition hover:bg-secondary">
                {label('חזרה', 'رجوع')}
              </button>
              <button onClick={() => setStep(2)}
                className="flex-1 rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:brightness-110">
                {label('הבא', 'التالي')}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Payment */}
        {step === 2 && (
          <div className="glass rounded-3xl p-8 text-center">
            <h2 className="mb-2 text-lg font-bold text-foreground">{label('אישור תשלום', 'تأكيد الدفع')}</h2>
            <p className="mb-8 text-sm text-muted-foreground">
              {label('תשלום מדומה — לחץ לאישור', 'دفع وهمي — اضغط للتأكيد')}
            </p>
            <div className="mb-8 inline-block rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <p className="text-4xl font-black text-foreground">{formatPrice(cartTotal)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label('סך הכל', 'إجمالي الطلب')}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 rounded-2xl border border-border py-3 text-sm font-medium text-foreground transition hover:bg-secondary">
                {label('חזרה', 'رجוע')}
              </button>
              <button onClick={handleOrder} disabled={loading}
                className="flex-1 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:brightness-110 disabled:opacity-50">
                {loading ? label('שולח...', 'جاري الإرسال...') : label('🎉 אשר הזמנה', '🎉 تأكيد الطلب')}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}