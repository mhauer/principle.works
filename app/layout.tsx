import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Principle",
  description: "Principle",
  metadataBase: new URL('https://principle.works'),
  openGraph: {
    title: "Principle",
    description: "Principle",
    url: 'https://principle.works',
    siteName: 'Principle',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Principle',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Principle",
    description: "Principle",
    images: ['/twitter-image.png'],
  },
  icons: {
    icon: [
      { url: '/icons/icon16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/icon64.png', sizes: '64x64', type: 'image/png' },
      { url: '/icons/icon128.png', sizes: '128x128', type: 'image/png' },
      { url: '/icons/icon256.png', sizes: '256x256', type: 'image/png' },
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icons/favicon.ico',
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/apple-touch-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/icons/apple-touch-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/apple-touch-icon-167x167.png', sizes: '167x167', type: 'image/png' },
      { url: '/icons/apple-touch-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
