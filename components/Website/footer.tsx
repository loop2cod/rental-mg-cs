"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function Footer() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <div className="h-12 flex items-center">
              {mounted ? (
                <img
                  src="/logo.svg"
                  alt="Event Rentals Logo"
                  className="h-full w-auto"
                />
              ) : (
                <div className="h-full w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              Your premier event rental service providing quality items for unforgettable celebrations. 
              From baby shoots to grand parties, we make every moment special.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  123 Event Street, Your City, 12345
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-600 dark:text-green-500 flex-shrink-0" />
                <a 
                  href="tel:+911234567890" 
                  className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                >
                  +91 12345 67890
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-green-600 dark:text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  Mon-Sun: 9AM-9PM
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} Event Rentals. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}