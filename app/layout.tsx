import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeContextProvider, { ColorTheme, Theme } from "@/context/ThemeContext";
import ClientProviders from "@/components/Providers/ClientProviders";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Momenz",
  description: "Momenz management for software",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialTheme = (cookieStore.get("theme")?.value as Theme) || "light";
  const initialColorTheme = (cookieStore.get("colorTheme")?.value as ColorTheme) || "zinc";

  const isDarkMode =
    initialTheme === "dark" ||
    (initialTheme === "system" && false); // Update this to use system preference

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${isDarkMode ? "dark" : ""}`}
        data-color-theme={initialColorTheme}
      >
        <ThemeContextProvider initialTheme={initialTheme} initialColorTheme={initialColorTheme}>
          <ClientProviders>
            <Toaster />
            {children}
          </ClientProviders>
        </ThemeContextProvider>
      </body>
    </html>
  );
}