'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from '../../../../features/users/usersSlice';
import { AppDispatch, RootState } from '../../../../store/store';
import { toast } from 'react-toastify';
import { Trash2, ShieldCheck, ShieldX } from 'lucide-react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((s: RootState) => s.users);
  const list = Array.isArray(users) ? users : [];
  const { t, lang } = useLang();

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const handleDelete = async (id: string) => {
    const r = await dispatch(deleteUser(id));
    if (deleteUser.fulfilled.match(r)) toast.success(t('تم الحذف ✅', 'נמחק בהצלחה ✅'));
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', direction: 'rtl' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff' }}>
          {t('إدارة المستخدمين', 'ניהול משתמשים')}
        </h1>
        <p style={{ color: '#555', fontSize: '13px', marginTop: '4px' }}>
          {list.length} {t('مستخدم', 'משתמשים')}
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
                  t('المستخدم', 'משתמש'),
                  t('البريد', 'אימייל'),
                  t('الدور', 'תפקיד'),
                  t('موثق', 'מאומת'),
                  t('التسجيل', 'הצטרף'),
                  t('إجراءات', 'פעולות'),
                ].map(h => (
                  <TableHead key={h} style={{ color: '#666', fontWeight: 500, textAlign: 'right' }}>
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {list.map((u) => (
                <TableRow key={u._id} style={{ borderTop: '1px solid #1a1a1a' }}>

                  {/* Name + Avatar — shadcn Avatar */}
                  <TableCell style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Avatar style={{ width: '36px', height: '36px', borderRadius: '50%' }}>
                        <AvatarFallback style={{
                          background: 'linear-gradient(135deg, #F7C948, #e6a800)',
                          color: '#1a1a1a', fontWeight: 700, fontSize: '13px',
                        }}>
                          {u.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span style={{ color: '#fff', fontWeight: 500 }}>{u.name}</span>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell style={{ padding: '14px 16px', color: '#666' }}>
                    {u.email}
                  </TableCell>

                  {/* Role — shadcn Badge */}
                  <TableCell style={{ padding: '14px 16px' }}>
                    <Badge style={{
                      background: u.role === 'admin' ? 'rgba(247,201,72,0.15)' : 'rgba(255,255,255,0.06)',
                      color: u.role === 'admin' ? '#F7C948' : '#aaa',
                      borderRadius: '8px', border: 'none', fontWeight: 500,
                    }}>
                      {u.role === 'admin' ? t('مدير', 'מנהל') : t('عميل', 'לקוח')}
                    </Badge>
                  </TableCell>

                  {/* Verified — shadcn Badge */}
                  <TableCell style={{ padding: '14px 16px' }}>
                    <Badge style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      background: u.isVerified ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: u.isVerified ? '#22c55e' : '#ef4444',
                      borderRadius: '8px', border: 'none',
                    }}>
                      {u.isVerified
                        ? <><ShieldCheck size={12} /> {t('موثق', 'מאומת')}</>
                        : <><ShieldX size={12} /> {t('غير موثق', 'לא מאומת')}</>
                      }
                    </Badge>
                  </TableCell>

                  {/* Date */}
                  <TableCell style={{ padding: '14px 16px', color: '#555', fontSize: '12px' }}>
                    {new Date(u.createdAt).toLocaleDateString(lang === 'ar' ? 'ar' : 'he')}
                  </TableCell>

                  {/* Delete — shadcn AlertDialog */}
                  <TableCell style={{ padding: '14px 16px' }}>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          style={{
                            width: '32px', height: '32px', borderRadius: '9px',
                            background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#888',
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent style={{
                        background: '#111', border: '1px solid #2a2a2a',
                        borderRadius: '18px', direction: 'rtl',
                      }}>
                        <AlertDialogHeader>
                          <AlertDialogTitle style={{ color: '#fff' }}>
                            {t('تأكيد الحذف', 'אישור מחיקה')}
                          </AlertDialogTitle>
                          <AlertDialogDescription style={{ color: '#888' }}>
                            {t(
                              `هل أنت متأكد من حذف "${u.name}"؟ لا يمكن التراجع.`,
                              `האם אתה בטוח שברצונך למחוק את "${u.name}"? לא ניתן לבטל.`
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel style={{
                            background: '#1a1a1a', border: '1px solid #2a2a2a',
                            color: '#fff', borderRadius: '10px',
                          }}>
                            {t('إلغاء', 'ביטול')}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(u._id)}
                            style={{ background: '#ef4444', color: '#fff', borderRadius: '10px', border: 'none' }}
                          >
                            {t('حذف', 'מחק')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>

                </TableRow>
              ))}

              {list.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#555' }}>
                    {t('لا يوجد مستخدمين', 'אין משתמשים')}
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