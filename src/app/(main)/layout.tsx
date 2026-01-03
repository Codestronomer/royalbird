// "use client"
import "~/styles/globals.css";
import Script from "next/script";

import { type Metadata } from "next";
import { Bangers, Chewy, Comic_Neue, Geist, Inter, Montserrat } from "next/font/google";
import Footer from "~/components/footer";
import BottomNav from "~/components/ui/bottomNav";
import { ThemeProvider } from "~/hooks/useTheme";

// export const metadata: Metadata = {
//   title: "Royal Bird Studios",
//   description: "",
//   icons: [{ rel: "icon", url: "/favicon.ico" }],
// };
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-montserrat",
});

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
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `(function(){try{const t=localStorage.getItem('theme'); if(t==='dark'){document.documentElement.classList.add('dark')}else if(!t && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark')} }catch(e){}})()` }} />
      </head>
      <body className="flex flex-col gap-4">
        <ThemeProvider>
          {/* <TopNav /> */}
          <BottomNav />
          {children}
          {/* Footer */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
