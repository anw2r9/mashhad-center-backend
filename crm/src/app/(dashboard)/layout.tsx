import Sidebar from '../../components/shared/Sidebar';
import Header from '../../components/shared/Header';
import ProtectedRoute from '../../components/shared/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#111827', direction: 'ltr' }}>
        <Sidebar />
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          direction: 'rtl',
          background: 'radial-gradient(ellipse at top right, rgba(247,201,72,0.08), transparent 50%)'        }}>
          <Header />
          <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
