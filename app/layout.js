import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { DarkModeProvider } from "@/components/DarkModeProvider";

const inter = Inter({ subsets: ["latin"] });

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const metadata = {
  title: "Welth",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <DarkModeProvider>
        <html lang="en" suppressHydrationWarning={true}>
          <head>
            <link rel="icon" href="/logo-sm.png" sizes="any" />
          </head>
          <body className={`${inter.className} bg-background text-foreground dark:bg-black dark:text-white`}>
            <Header />
            <main className="min-h-screen">
              {/* Test element for dark mode */}
              <div className="p-4 bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg mb-4 text-center">
                This box should change color in dark mode!
              </div>
              {children}
            </main>
            <Toaster richColors />
            <footer className="bg-blue-50 py-12 dark:bg-neutral-900 dark:text-neutral-300">
              <div className="container mx-auto px-4 text-center text-gray-600 dark:text-neutral-300">
                <p>All Rights Reserved @Utkarsh Dwivedi</p>
              </div>
            </footer>
          </body>
        </html>
      </DarkModeProvider>
    </ClerkProvider>
  );
}
