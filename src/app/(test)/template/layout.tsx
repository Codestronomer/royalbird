import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="flex flex-col gap-4">
        {children}
      </body>
    </html>
  );
}
