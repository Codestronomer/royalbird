import { Chewy } from "next/font/google"
import { Toaster } from "react-hot-toast";
import "~/styles/globals.css";

const chewy = Chewy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-chewy",
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${chewy.className}`}>
      <body className="flex flex-col gap-4">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  )
}