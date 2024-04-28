import './globals.css'
import type { Metadata } from 'next'
import { Roboto_Mono } from 'next/font/google'
import { type ReactNode } from 'react'

import { Providers } from './providers'

const font = Roboto_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Unofficial Moonwell reward claim',
  description: 'This app allows you to claim rewards from the different Moonwell markets without using the button on the frontend.',
}

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Providers>{props.children}</Providers>
        <footer style={{textAlign:'right', padding:'1rem'}}>
          <a href='https://github.com/ismaventuras/moonwell-claim-rewards-single-market'>Source Code</a>
        </footer>
      </body>
    </html>
  )
}
