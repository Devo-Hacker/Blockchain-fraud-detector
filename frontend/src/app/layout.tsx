import "./globals.css";

export const metadata = {
  title: "Smart-Chain Analyzer",
  description: "Risk & Compliance Hub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#06080D] text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}