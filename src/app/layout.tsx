import './globals.css'
import type { Metadata } from 'next'
import React from 'react'
import { cn } from '@/lib/utils'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import ModalProvider from '@/components/providers/modal-provider'
import SocketProvider from '@/components/providers/socket-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { PanelProvider } from '@/components/providers/panel-provider'
import { Toaster } from '@/components/ui/sonner'
import { NetworkProvider } from '@/components/providers/network'
import { Finder } from '@/components/finder/finder'
import { GlobalDataProvider } from '@/components/providers/global-data-provider'

export const metadata: Metadata = {
  title: 'LC (Live Connect)',
  description: 'Live communication app built with Next.js and Tailwind CSS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn('dark:bg-[hsl(var(--background-deep-dark))]')}>
          <NetworkProvider>
            <ThemeProvider attribute={'class'} defaultTheme={'dark'} enableSystem={false} storageKey={'__THEME'}>
              <SocketProvider>
                <GlobalDataProvider />
                <Finder />
                <ModalProvider />
                <PanelProvider />
                <Toaster />
                <QueryProvider>{children}</QueryProvider>
              </SocketProvider>
            </ThemeProvider>
          </NetworkProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
