import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import StructuredData from "@/components/StructuredData";
import { seoConfig } from "@/lib/seo-config";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Bharat Cover - Corporate Insurance Solutions for Your Workforce",
    template: "%s | Bharat Cover"
  },
  description: "Comprehensive Personal Accident and Employee Insurance Solutions for Businesses. Protect your workforce with trusted corporate insurance care from Bharat Cover.",
  keywords: [
    "corporate insurance",
    "employee insurance",
    "personal accident insurance",
    "group health insurance",
    "workmen compensation",
    "business insurance",
    "group term life insurance",
    "OPD wellness plans",
    "MSME insurance",
    "corporate insurance care",
    "employee benefits",
    "corporate health insurance"
  ],
  authors: [{ name: "Bharat Cover" }],
  creator: "Bharat Cover",
  publisher: "Bharat Cover",
  metadataBase: new URL(seoConfig.siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: seoConfig.siteUrl,
    siteName: "Bharat Cover",
    title: "Bharat Cover - Corporate Insurance Solutions",
    description: "Comprehensive Personal Accident and Employee Insurance Solutions for Businesses. Trusted by 100+ companies across India.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bharat Cover - Corporate Insurance Solutions"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Bharat Cover - Corporate Insurance Solutions",
    description: "Comprehensive Personal Accident and Employee Insurance Solutions for Businesses",
    images: ["/images/og-image.jpg"],
    creator: "@bharatcover",
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
  verification: {
    google: seoConfig.googleSiteVerification,
  },
  category: 'Insurance',
};

import ClientMain from "@/components/ClientMain";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={seoConfig.siteUrl} />
        <meta name="theme-color" content="#0066cc" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <GoogleAnalytics measurementId={seoConfig.googleAnalyticsId} />
        <StructuredData data={seoConfig.getOrganizationSchema()} />
        <StructuredData data={seoConfig.getWebsiteSchema()} />
        <Header />
        <ClientMain>{children}</ClientMain>
        <Footer />
      </body>
    </html>
  );
}
