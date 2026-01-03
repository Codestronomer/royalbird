import { Chewy } from "next/font/google"
import { Toaster } from "react-hot-toast";
import "~/styles/globals.css";
import Script from "next/script";
import { ThemeProvider } from "~/hooks/useTheme";

const chewy = Chewy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-chewy",
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${chewy.className}`} suppressHydrationWarning>
      <head>
        <Script 
          id="theme-init" 
          strategy="beforeInteractive" 
          dangerouslySetInnerHTML={{ 
            __html: `(function(){try{const t=localStorage.getItem('theme'); if(t==='dark'){document.documentElement.classList.add('dark')}else if(!t && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark')} }catch(e){}})()` 
          }} 
        />
      </head>
      <body className="flex flex-col gap-4">
        <ThemeProvider>
          <Toaster position="top-right" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}