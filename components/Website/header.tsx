"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()



  useEffect(() => {
    const handleScroll = () => {
      // Update header background when scrolled
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    // Initial check in case page is loaded scrolled down
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Handle logo click with theme preservation
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // Use router.push instead of Link's default behavior
    router.push("/")
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled ? "bg-white/95 dark:bg-[#627421]/95 backdrop-blur-sm shadow-sm border-b border-[#627421]/20 dark:border-[#627421]/50" : "bg-transparent"
        }`}
      >
        <div className="container py-4 mx-auto  p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center" onClick={handleLogoClick}>
                <img
                  src={'/logo.svg'}
                  alt="Event Rentals Logo"
                  className="h-7 md:h-12 w-auto filter drop-shadow-sm logo-filter"
                />
            </div>

            <div className="flex items-center space-x-6">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="#contact" className="bg-[#627421] hover:bg-[#4d5c1a] text-white px-4 py-2 rounded-lg transition-colors">
                  Contact Us
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
