import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SocialSage - Instagram Analytics & Optimization for Content Creators',
  description: 'Join the waitlist for SocialSage - Advanced Instagram analytics and optimization tools for content creators and marketing agencies. Get free extra tokens as an early user!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <script src="https://va.vercel-scripts.com/v1/script.js" data-auto="false" defer></script>
      </body>
    </html>
  )
}