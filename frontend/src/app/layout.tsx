import "./globals.css";

export const metadata = { title: "DhanTrace — Crypto Fraud Investigation" };

import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="grid grid-cols-[250px_1fr] min-h-screen">
          <Sidebar />
          <main className="px-9 pt-8 pb-16">{children}</main>
        </div>
      </body>
    </html>
  );
}