import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UAE Discount Hub - Find Best Deals on Amazon.ae, Noon & More",
  description: "Compare prices across UAE's top e-commerce platforms including Amazon.ae, Noon, Namshi, and more. Find the best deals on electronics, fashion, home appliances, and save money on every purchase.",
  keywords: "UAE discounts, price comparison, Amazon UAE deals, Noon offers, best prices UAE, online shopping UAE",
  authors: [{ name: "UAE Discount Hub" }],
  openGraph: {
    title: "UAE Discount Hub - Find Best Deals & Prices in UAE",
    description: "Compare prices and find the best deals across UAE's leading e-commerce platforms",
    url: "https://uaediscounthub.com",
    siteName: "UAE Discount Hub",
    locale: "en_AE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UAE Discount Hub - Best Deals in UAE",
    description: "Compare prices and find the best deals across UAE's leading e-commerce platforms",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
