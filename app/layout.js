import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Welth",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    
      <html lang="en">
      <Header/>
        <body className={`${inter.className}`}>{children}
          
        </body>
      </html>
    
  );
}
