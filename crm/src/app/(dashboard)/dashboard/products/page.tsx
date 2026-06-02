'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../../../features/products/productsSlice';
import { AppDispatch, RootState } from '../../../../store/store';
import { useLang } from '../../../../lib/lang';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash2, Package, Upload } from 'lucide-react';

// ============ shadcn components ============
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// ============ Constants ============
const emptyForm = { name: '', price: '', stock: '', category: '', description: '' };

const categories = [
  { value: 'cement',   he: 'מלט ובטון',    ar: 'اسمنت وخرسانة' },
  { value: 'steel',    he: 'ברזל',          ar: 'حديد' },
  { value: 'blocks',   he: 'בלוקים',        ar: 'بلوك' },
  { value: 'sand',     he: 'חול',           ar: 'رمل' },
  { value: 'gravel',   he: 'חצץ',           ar: 'حصى' },
  { value: 'tools',    he: 'כלי עבודה',     ar: 'أدوات' },
  { value: 'paint',    he: 'צבע',           ar: 'دهان' },
  { value: 'plumbing', he: 'אינסטלציה',     ar: 'سباكة' },
];

// ============ Shared input style (dark theme override) ============
const darkInput: React.CSSProperties = {
  background: '#0d0d0d',
  border: '1px solid #2a2a2a',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '13px',
};

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector((s: RootState) => s.products);
  const list = Array.isArray(products) ? products : [];
  const { t, lang } = useLang();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleOpen = (product?: any) => {
    if (product) {
      setEditId(product._id);
      setForm({
        name: product.name || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category || '',
        description: product.description || '',
      });
      setPreview(product.images?.[0] || null);
    } else {
      setEditId(null);
      setForm(emptyForm);
      setPreview(null);
      setImageFile(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPreview(null);
    setImageFile(null);
  };

  const uploadImage = async (productId: string) => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append('image', imageFile);
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`http://localhost:5000/api/v1/products/${productId}/upload-image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!data.success) throw new Error('Image upload failed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      if (editId) {
        const r = await dispatch(updateProduct({ id: editId, ...form, price: Number(form.price), stock: Number(form.stock) }));
        if (updateProduct.fulfilled.match(r)) {
          if (imageFile) await uploadImage(editId);
          toast.success(t('تم التعديل ✅', 'עודכן בהצלחה ✅'));
        }
      } else {
        const r = await dispatch(createProduct({ ...form, price: Number(form.price), stock: Number(form.stock) }));
        if (createProduct.fulfilled.match(r)) {
          const newId = (r.payload as any)._id;
          if (imageFile && newId) await uploadImage(newId);
          toast.success(t('تمت الإضافة ✅', 'נוסף בהצלחה ✅'));
        }
      }
      dispatch(fetchProducts());
      handleClose();
    } catch {
      toast.error(t('حدث خطأ', 'אירעה שגיאה'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const r = await dispatch(deleteProduct(id));
    if (deleteProduct.fulfilled.match(r)) toast.success(t('تم الحذف ✅', 'נמחק בהצלחה ✅'));
  };

  const getCatLabel = (val: string) => {
    const cat = categories.find(c => c.value === val);
    if (!cat) return val;
    return lang === 'ar' ? cat.ar : cat.he;
  };

  // Filter
  const filteredList = list
    .filter(p => !selectedCategory || p.category === selectedCategory)
    .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getCategoryCount = (cat: string) => list.filter(p => p.category === cat).length;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', direction: 'rtl' }}>

      {/* ===== HEADER ===== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff' }}>
            {t('إدارة المنتجات', 'ניהול מוצרים')}
          </h1>
          <p style={{ color: '#555', fontSize: '13px', marginTop: '4px' }}>
            {filteredList.length} {t('منتج', 'מוצרים')}
          </p>
        </div>

        {/* shadcn Button */}
        <Button
          onClick={() => handleOpen()}
          style={{
            background: 'linear-gradient(135deg, #F7C948, #e6a800)',
            color: '#1a1a1a',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '14px',
            boxShadow: '0 0 20px rgba(247,201,72,0.3)',
            border: 'none',
          }}
        >
          <Plus size={18} className="ml-2" />
          {t('إضافة منتج', 'הוסף מוצר')}
        </Button>
      </div>

      {/* ===== SEARCH + CATEGORY FILTER ===== */}
      <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#111', border: '1px solid #1f1f1f', borderRadius: '18px' }}>

        {/* Search — shadcn Input */}
        <Input
          placeholder={t('ابحث عن منتج...', 'חפש מוצר...')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ ...darkInput, marginBottom: '12px', height: '40px' }}
          className="placeholder:text-[#555] focus-visible:ring-[#F7C948]/30"
        />

        <p style={{ fontSize: '13px', color: '#888', marginBottom: '10px', fontWeight: 600 }}>
          {t('تصفية حسب الفئة:', 'סננו לפי קטגוריה:')}
        </p>

        {/* Category buttons — shadcn Button variant */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button
            variant={!selectedCategory ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('')}
            style={{
              borderRadius: '10px',
              background: !selectedCategory ? 'linear-gradient(135deg, #F7C948, #e6a800)' : '#1a1a1a',
              color: !selectedCategory ? '#1a1a1a' : '#888',
              border: !selectedCategory ? 'none' : '1px solid #2a2a2a',
              fontSize: '13px',
            }}
          >
            {t('الكل', 'הכל')} ({list.length})
          </Button>

          {categories.map(cat => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.value)}
              style={{
                borderRadius: '10px',
                background: selectedCategory === cat.value ? 'linear-gradient(135deg, #F7C948, #e6a800)' : '#1a1a1a',
                color: selectedCategory === cat.value ? '#1a1a1a' : '#888',
                border: selectedCategory === cat.value ? 'none' : '1px solid #2a2a2a',
                fontSize: '13px',
              }}
            >
              {lang === 'ar' ? cat.ar : cat.he} ({getCategoryCount(cat.value)})
            </Button>
          ))}
        </div>
      </div>

      {/* ===== TABLE — shadcn Table ===== */}
      {loading ? (
        <p style={{ color: '#555' }}>{t('جاري التحميل...', 'טוען...')}</p>
      ) : (
        <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '18px', overflow: 'hidden' }}>
          <Table>
            <TableHeader style={{ background: 'rgba(255,255,255,0.03)' }}>
              <TableRow style={{ borderBottom: '1px solid #1a1a1a' }}>
                <TableHead style={{ color: '#666', fontWeight: 500, textAlign: 'right' }}>{t('المنتج', 'מוצר')}</TableHead>
                <TableHead style={{ color: '#666', fontWeight: 500, textAlign: 'right' }}>{t('السعر', 'מחיר')}</TableHead>
                <TableHead style={{ color: '#666', fontWeight: 500, textAlign: 'right' }}>{t('المخزون', 'מלאי')}</TableHead>
                <TableHead style={{ color: '#666', fontWeight: 500, textAlign: 'right' }}>{t('الفئة', 'קטגוריה')}</TableHead>
                <TableHead style={{ color: '#666', fontWeight: 500, textAlign: 'right' }}>{t('إجراءات', 'פעולות')}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredList.map((p) => (
                <TableRow key={p._id} style={{ borderTop: '1px solid #1a1a1a' }}>

                  {/* Product name + image */}
                  <TableCell style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {(p as any).images?.[0] ? (
                        <img
                          src={(p as any).images[0]}
                          alt={p.name}
                          style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Package size={18} color="#F7C948" />
                        </div>
                      )}
                      <span style={{ color: '#fff', fontWeight: 500 }}>{p.name}</span>
                    </div>
                  </TableCell>

                  {/* Price */}
                  <TableCell style={{ padding: '14px 16px', color: '#F7C948', fontWeight: 700 }}>
                    ₪{p.price}
                  </TableCell>

                  {/* Stock — shadcn Badge */}
                  <TableCell style={{ padding: '14px 16px' }}>
                    <Badge
                      style={{
                        background: p.stock > 0 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                        color: p.stock > 0 ? '#22c55e' : '#ef4444',
                        borderRadius: '8px',
                        fontWeight: 500,
                        border: 'none',
                      }}
                    >
                      {p.stock}
                    </Badge>
                  </TableCell>

                  {/* Category — shadcn Badge */}
                  <TableCell style={{ padding: '14px 16px' }}>
                    <Badge
                      style={{
                        background: 'rgba(247,201,72,0.1)',
                        color: '#F7C948',
                        borderRadius: '8px',
                        border: 'none',
                      }}
                    >
                      {getCatLabel(p.category)}
                    </Badge>
                  </TableCell>

                  {/* Actions — shadcn Button + AlertDialog */}
                  <TableCell style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>

                      {/* Edit */}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpen(p)}
                        style={{ width: '32px', height: '32px', borderRadius: '9px', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#888' }}
                      >
                        <Pencil size={14} />
                      </Button>

                      {/* Delete with confirmation */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            style={{ width: '32px', height: '32px', borderRadius: '9px', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#888' }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '18px' }}>
                          <AlertDialogHeader>
                            <AlertDialogTitle style={{ color: '#fff' }}>
                              {t('تأكيد الحذف', 'אישור מחיקה')}
                            </AlertDialogTitle>
                            <AlertDialogDescription style={{ color: '#888' }}>
                              {t('هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع.', 'האם אתה בטוח שברצונך למחוק מוצר זה? לא ניתן לבטל.')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#fff', borderRadius: '10px' }}>
                              {t('إلغاء', 'ביטול')}
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(p._id)}
                              style={{ background: '#ef4444', color: '#fff', borderRadius: '10px', border: 'none' }}
                            >
                              {t('حذف', 'מחק')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#555' }}>
                    {t('لا يوجد منتجات', 'אין מוצרים')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ===== DIALOG — shadcn Dialog ===== */}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          style={{
            background: '#111',
            border: '1px solid #2a2a2a',
            borderRadius: '20px',
            maxWidth: '520px',
            maxHeight: '90vh',
            overflowY: 'auto',
            direction: 'rtl',
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: '#fff', fontSize: '18px' }}>
              {editId ? t('تعديل المنتج', 'עריכת מוצר') : t('إضافة منتج جديد', 'הוסף מוצר חדש')}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>

            {/* Image Upload */}
            <div>
              <Label style={{ color: '#888', fontSize: '13px', marginBottom: '8px', display: 'block' }}>
                {t('صورة المنتج', 'תמונת מוצר')}
              </Label>
              <label style={{ display: 'block', cursor: 'pointer' }}>
                <div style={{
                  border: '2px dashed #2a2a2a', borderRadius: '14px',
                  padding: '1.25rem', textAlign: 'center',
                  background: '#0d0d0d', overflow: 'hidden',
                }}>
                  {preview ? (
                    <img src={preview} alt="preview" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#555' }}>
                      <Upload size={28} color="#F7C948" />
                      <p style={{ fontSize: '13px' }}>{t('اضغط لرفع صورة', 'לחץ להעלאת תמונה')}</p>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
            </div>

            {/* Name — shadcn Input */}
            <div>
              <Label style={{ color: '#888', fontSize: '13px', marginBottom: '6px', display: 'block' }}>
                {t('اسم المنتج', 'שם מוצר')} *
              </Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                style={darkInput}
                className="placeholder:text-[#555] focus-visible:ring-[#F7C948]/30"
              />
            </div>

            {/* Category — shadcn Select */}
            <div>
              <Label style={{ color: '#888', fontSize: '13px', marginBottom: '6px', display: 'block' }}>
                {t('الفئة', 'קטגוריה')} *
              </Label>
              <Select
                value={form.category}
                onValueChange={val => setForm({ ...form, category: val })}
                required
              >
                <SelectTrigger style={{ ...darkInput, height: '44px' }} className="focus:ring-[#F7C948]/30">
                  <SelectValue placeholder={t('اختر الفئة...', 'בחר קטגוריה...')} style={{ color: form.category ? '#fff' : '#555' }} />
                </SelectTrigger>
                <SelectContent style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px' }}>
                  {categories.map(c => (
                    <SelectItem
                      key={c.value}
                      value={c.value}
                      style={{ color: '#fff', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      {lang === 'ar' ? c.ar : c.he}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price + Stock — shadcn Input */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <Label style={{ color: '#888', fontSize: '13px', marginBottom: '6px', display: 'block' }}>
                  {t('السعر (₪)', 'מחיר (₪)')} *
                </Label>
                <Input
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  required
                  style={darkInput}
                  className="focus-visible:ring-[#F7C948]/30"
                />
              </div>
              <div>
                <Label style={{ color: '#888', fontSize: '13px', marginBottom: '6px', display: 'block' }}>
                  {t('المخزون', 'מלאי')} *
                </Label>
                <Input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  style={darkInput}
                  className="focus-visible:ring-[#F7C948]/30"
                />
              </div>
            </div>

            {/* Description — shadcn Textarea */}
            <div>
              <Label style={{ color: '#888', fontSize: '13px', marginBottom: '6px', display: 'block' }}>
                {t('الوصف', 'תיאור')}
              </Label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                style={{ ...darkInput, resize: 'vertical' }}
                className="focus-visible:ring-[#F7C948]/30"
              />
            </div>

            {/* Submit — shadcn Button */}
            <Button
              type="submit"
              disabled={uploading}
              style={{
                width: '100%',
                background: uploading ? 'rgba(247,201,72,0.5)' : 'linear-gradient(135deg, #F7C948, #e6a800)',
                color: '#1a1a1a',
                border: 'none',
                borderRadius: '12px',
                padding: '13px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: uploading ? 'not-allowed' : 'pointer',
                height: 'auto',
              }}
            >
              {uploading
                ? t('جاري الحفظ...', 'שומר...')
                : editId
                  ? t('حفظ التعديلات', 'שמור שינויים')
                  : t('إضافة المنتج', 'הוסף מוצר')
              }
            </Button>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}