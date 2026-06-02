'use client'
// بديل عن react-toastify — يستخدم الـ Toaster المصمم
import { useStore } from '@/components/store-provider'

export function useToast() {
  const { pushToast } = useStore()

  return {
    success: (message: string) => pushToast({ title: message, variant: 'success' }),
    error:   (message: string) => pushToast({ title: message, variant: 'error' }),
    info:    (message: string) => pushToast({ title: message, variant: 'info' }),
  }
}