import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../../public/CSS/globals.css'
import '../../public/CSS/background.css';
import '../../public/CSS/menu.css';
import '../../public/CSS/component.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pong',
  description: 'The platform to challenge your friends',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
