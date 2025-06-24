// src/app/layout.js
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Providers from './providers'

export const metadata = {
  title: 'Earner Eagle',
  description: 'Earn Cash, Gift Cards and Games Credits',
    icons: {
    icon: '/earner-eagle.webp', // ✅ add your favicon path here
  },
}

// **CALL FONT LOADERS AT MODULE SCOPE**
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}