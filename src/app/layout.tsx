import './globals.css'
import type { Metadata } from 'next'
import React from 'react'
import { cn } from '@/lib/utils'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import ModalProvider from '@/components/providers/modal-provider'
import SocketProvider from '@/components/providers/socket-provider'
import { QueryProvider } from '@/components/providers/query-provider'

export const metadata: Metadata = {
  title: 'LC (Live Connect)',
  description: 'Live communication app built with Next.js and Tailwind CSS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn('dark:bg-[hsl(var(--background-deep-dark))]')}>
          <ThemeProvider attribute={'class'} defaultTheme={'dark'} enableSystem={false} storageKey={'__THEME'}>
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>{children}</QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
