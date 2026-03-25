import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ServiceWorkerRegistrar } from '@/components/providers/ServiceWorkerRegistrar';
import { I18nProvider } from '@/components/providers/I18nProvider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'MedFlow — Healthcare Management Platform',
    template: '%s | MedFlow',
  },
  description:
    'Platform manajemen klinik all-in-one untuk fasilitas kesehatan di Indonesia. Kelola pasien, jadwal, rekam medis, resep, dan tagihan dalam satu aplikasi.',
  keywords: ['healthcare', 'klinik', 'manajemen', 'EMR', 'medical records', 'Indonesia'],
  authors: [{ name: 'MedFlow' }],
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0d9488' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <I18nProvider>
            <ServiceWorkerRegistrar />
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                classNames: {
                  toast: 'font-sans',
                },
              }}
            />
          </I18nProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
