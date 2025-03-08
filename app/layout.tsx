import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeContextProvider from "@/context/ThemeContext";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rental management",
  description: "Rental management for software",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialTheme = (cookieStore.get("theme")?.value as "light" | "dark" | "system") || "light";

  const isDarkMode =
    initialTheme === "dark" ||
    (initialTheme === "system" &&
      false);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${isDarkMode ? "dark" : ""}`}
      >
        <ThemeContextProvider initialTheme={initialTheme}>
          {children}
        </ThemeContextProvider>
      </body>
    </html>
  );
}