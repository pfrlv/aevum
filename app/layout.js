import { EB_Garamond } from 'next/font/google'
import './globals.css'

const garamond = EB_Garamond({
  variable: '--font-garamond',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Aevum',
  applicationName: 'Aevum',
  creator: 'Pasha Frolov',
  description:
    'Tempus oscillat inter principium indefinitum et infinitatem fluentem',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${garamond.variable} antialiased font-base bg-black cursor-default selection:bg-transparent`}
      >
        {children}
      </body>
    </html>
  )
}
