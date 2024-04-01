import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.css'
import { CookiesProvider } from 'next-client-cookies/server';
import Head from 'next/head';
import { Suspense } from "react";
import Loading from "./loading";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  openGraph: {
    title: 'Next.js',
    description: 'The React Framework for the Web',
    url: 'https://nextjs.org',
    siteName: 'Next.js',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico', // /public path
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (

    <html lang="en">
      <Head>
        <link rel="icon" href="/faicon.ico" />
      </Head>
      <body className={inter.className}>
        
        <div className=" ">
          {/* <CookiesProvider> */}
            {children}
          {/* </CookiesProvider> */}
        </div>
      </body>
    </html>
  );
}
