import type { Metadata } from 'next';
import './globals.css';
import Providers from './Providers';
import { StoreProvider } from '@/components/store-provider';
import { CartDrawer } from '@/components/site/cart-drawer';
import { Toaster } from '@/components/site/toaster';

export const metadata: Metadata = {
  title: {
    default: 'משהד סנטר | مشهد سنتر',
    template: '%s | משהד סנטר',
  },
  description: 'מרכז חומרי הבניין שלך | مركز مواد البناء',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body suppressHydrationWarning>
        <Providers>
          <StoreProvider>
            {children}
            {/* CartDrawer و Toaster في كل الصفحات */}
            <CartDrawer />
            <Toaster />
          </StoreProvider>
        </Providers>
      </body>
    </html>
  );
}
