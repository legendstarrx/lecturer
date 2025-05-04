import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lecturer - Professional ADX Setup Services",
  description: "Get professional ADX setup services for your WordPress site. Choose from our range of packages including Normal Setup, Premium Setup, and High eCPM Setup.",
  keywords: "ADX setup, WordPress, Google Ad Manager, ad optimization, eCPM, lazy loading, inventory optimization",
  authors: [{ name: "Lecturer ADX" }],
  publisher: "Lecturer ADX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lecturer.vercel.app'),
  alternates: {
    canonical: "https://lecturer.vercel.app",
  },
  openGraph: {
    title: "Lecturer - Professional ADX Setup Services",
    description: "Get professional ADX setup services for your WordPress site. Choose from our range of packages including Normal Setup, Premium Setup, and High eCPM Setup.",
    url: 'https://lecturer.vercel.app',
    siteName: 'Lecturer ADX',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lecturer ADX Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Lecturer - Professional ADX Setup Services",
    description: "Get professional ADX setup services for your WordPress site. Choose from our range of packages including Normal Setup, Premium Setup, and High eCPM Setup.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: 'your-google-site-verification',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script id="structured-data" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "LECTURER",
              "description": "Expert ADX Setup, AdSense Optimization, and Digital Marketing Agency Services",
              "url": "https://lecturer.vercel.app",
              "logo": "https://lecturer.vercel.app/logo.png",
              "sameAs": [
                "https://twitter.com/lecturer",
                "https://facebook.com/lecturer"
              ],
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "NGN",
                "lowPrice": "50000",
                "highPrice": "200000",
                "offerCount": "3"
              },
              "areaServed": {
                "@type": "Country",
                "name": "Nigeria"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Digital Marketing Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "ADX Setup Service",
                      "description": "Professional setup and optimization of Google Ad Exchange"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Ad Management Agency",
                      "description": "Comprehensive ad management services for Facebook and TikTok"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Blog Monetization",
                      "description": "Expert AdSense optimization and blog monetization services"
                    }
                  }
                ]
              }
            }
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50">
        {children}
        </main>
      </body>
    </html>
  );
}
