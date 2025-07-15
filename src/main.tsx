import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { KeyboardNavigationProvider } from '@/components/accessibility/KeyboardNavigationProvider';
import { SkipLinks } from '@/components/accessibility/SkipLink';
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

// Ensure the theme is applied immediately
const savedTheme = localStorage.getItem('vite-ui-theme')
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
const theme = savedTheme || 'system'

if (theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <KeyboardNavigationProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <SkipLinks />
          <AuthProvider>
            <App />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </KeyboardNavigationProvider>
    </QueryClientProvider>
  </StrictMode>,
)