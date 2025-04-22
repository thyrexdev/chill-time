import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {Montserrat} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const montserrat = Montserrat({
    variable: "--font-family",
    style: "normal",
})

export const metadata: Metadata = {
  title: "Chill Time",
  description: "A website for Chill Time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased`}
      >
      <Navbar />
        {children}
      </body>
    </html>
  );
}
