'use client';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LangProvider } from '../lib/lang';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LangProvider>
        {children}
        <ToastContainer position="top-right" rtl />
      </LangProvider>
    </Provider>
  );
}