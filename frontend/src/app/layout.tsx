import "./globals.css";
import { Manrope, JetBrains_Mono } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = { title: "DhanTrace — Crypto Fraud Investigation" };

import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${jetbrainsMono.variable} font-sans`}>
        <div className="grid grid-cols-[250px_1fr] min-h-screen">
          <Sidebar />
          <main className="px-9 pt-8 pb-16">{children}</main>
        </div>
      </body>
    </html>
  );
}