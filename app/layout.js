import { DarkModeProvider } from "@/components/DarkModeProvider";
import ThemeScript from "@/components/ThemeScript";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import { Button } from "@/components/ui/button"; // Import Button component
import { Github, Linkedin } from "lucide-react"; // Import icons from lucide-react

const inter = Inter({ subsets: ["latin"] });

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHable_KEY;

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
            {/* Updated Professional Footer with Buttons and Icons */}
            <footer className="bg-blue-50 py-12 dark:bg-neutral-900 dark:text-neutral-300">
              <div className="container mx-auto px-4 text-center text-gray-600 dark:text-neutral-300">
                <p className="mb-2 text-sm">
                  Developed by <span className="font-semibold">Utkarsh Dwivedi</span>
                </p>
                <div className="flex justify-center space-x-4 mb-4">
                  <Button
                    asChild // Render as a child of the Button component (an <a> tag)
                    variant="ghost" // Use a ghost variant for a subtle button style
                    size="icon" // Make it an icon button (square with padding)
                    className="text-gray-600 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white transition-colors duration-200"
                  >
                    <a
                      href="https://github.com/utkarshup32" // Replace with your actual GitHub URL
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub Profile" // Accessibility label
                    >
                      <Github className="h-6 w-6" /> {/* GitHub Icon */}
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white transition-colors duration-200"
                  >
                    <a
                      href="https://www.linkedin.com/in/utkarsh-dwivedi-bb0842260/" // Replace with your actual LinkedIn URL
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn Profile" // Accessibility label
                    >
                      <Linkedin className="h-6 w-6" /> {/* LinkedIn Icon */}
                    </a>
                  </Button>
                </div>
                <p className="text-xs">&copy; {new Date().getFullYear()}   WELTH. All Rights Reserved.</p>
              </div>
            </footer>
          </body>
        </html>
      </DarkModeProvider>
    </ClerkProvider>
  );
}
