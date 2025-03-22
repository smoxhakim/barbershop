"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Scissors } from "lucide-react"
import MobileNavigation from "./MobileNavigation"

const Navbar: React.FC = () => {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Scissors className="h-6 w-6 text-primary" />
            <span className="font-medium text-xl">Modern Cuts</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`transition-colors duration-200 ${
                pathname === "/" ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/booking"
              className={`transition-colors duration-200 ${
                pathname === "/booking" ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              Book Now
            </Link>
            <Link
              href="/admin"
              className={`transition-colors duration-200 ${
                pathname === "/admin" ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              Admin
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <MobileNavigation />
        </div>
      </div>
    </header>
  )
}

export default Navbar

