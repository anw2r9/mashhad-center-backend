'use client';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Bell, Search } from 'lucide-react';
import { useLang } from '../../lib/lang';


// ============ shadcn components ============
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Header() {
  const { admin } = useSelector((s: RootState) => s.auth);
  const { lang, setLang, t } = useLang();

  return (
    <header
      style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        borderBottom: '1px solid #1a1a1a',
        background: 'rgba(13,13,13,0.8)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Search — shadcn Input */}
      <div style={{ position: 'relative', width: '280px' }}>
        <Search
          size={15}
          color="#555"
          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        />
        <Input
          placeholder={t('بحث عن أي شيء...', 'חפש כל דבר...')}
          style={{
            background: '#141414',
            border: '1px solid #222',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '13px',
            paddingRight: '36px',
            height: '40px',
          }}
          className="placeholder:text-[#555] focus-visible:ring-[#F7C948]/30"
        />
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

        {/* Date */}
        <span style={{ fontSize: '13px', color: '#F7C948' }}>
          {new Date().toLocaleDateString(lang === 'ar' ? 'ar' : 'he', {
            weekday: 'long', day: 'numeric', month: 'long',
          })}
        </span>

        {/* Language Toggle — shadcn Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLang(lang === 'ar' ? 'he' : 'ar')}
          style={{
            background: '#1a1a1a',
            border: '1px solid #333',
            color: '#F7C948',
            fontSize: '13px',
            fontWeight: 600,
            borderRadius: '10px',
          }}
        >
          {lang === 'ar' ? 'עב' : 'عر'}
        </Button>

        {/* Bell — shadcn Button with Badge */}
        <div style={{ position: 'relative' }}>
          <Button
            variant="outline"
            size="icon"
            style={{
              width: '38px', height: '38px',
              borderRadius: '11px',
              background: '#141414',
              border: '1px solid #222',
            }}
          >
            <Bell size={17} color="#888" />
          </Button>
          {/* Notification dot */}
          <Badge
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              padding: 0,
              borderRadius: '50%',
              background: '#F7C948',
              minWidth: 'unset',
            }}
          />
        </div>

        {/* Admin Info — shadcn DropdownMenu + Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                  {(admin as any)?.name || 'Admin'}
                </p>
                <p style={{ fontSize: '11px', color: '#555' }}>
                  {t('مدير النظام', 'מנהל מערכת')}
                </p>
              </div>
              <Avatar style={{ width: '38px', height: '38px', borderRadius: '11px' }}>
                <AvatarFallback
                  style={{
                    background: 'linear-gradient(135deg, #F7C948, #e6a800)',
                    color: '#1a1a1a',
                    fontWeight: 700,
                    fontSize: '14px',
                    borderRadius: '11px',
                  }}
                >
                  {(admin as any)?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            style={{ background: '#111', border: '1px solid #222', borderRadius: '14px', minWidth: '180px' }}
          >
            <DropdownMenuLabel style={{ color: '#888', fontSize: '12px' }}>
              {(admin as any)?.email || 'admin@mashhad.com'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator style={{ background: '#222' }} />
            <DropdownMenuItem style={{ color: '#fff', cursor: 'pointer', borderRadius: '8px' }}>
              {t('الملف الشخصي', 'פרופיל')}
            </DropdownMenuItem>
            <DropdownMenuItem style={{ color: '#fff', cursor: 'pointer', borderRadius: '8px' }}>
              {t('الإعدادات', 'הגדרות')}
            </DropdownMenuItem>
            <DropdownMenuSeparator style={{ background: '#222' }} />
            <DropdownMenuItem style={{ color: '#ef4444', cursor: 'pointer', borderRadius: '8px' }}>
              {t('تسجيل الخروج', 'התנתק')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}