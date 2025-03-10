"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Scissors } from "lucide-react"

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Scissors className="h-6 w-6 text-primary" />
            <span className="font-medium text-xl">Modern Cuts</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors duration-200">
              Home
            </Link>
            <Link to="/booking" className="text-foreground hover:text-primary transition-colors duration-200">
              Book Now
            </Link>
            <Link to="/admin" className="text-foreground hover:text-primary transition-colors duration-200">
              Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center text-foreground"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 top-[61px] bg-background z-40 md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <nav className="flex flex-col items-center justify-center h-full space-y-8">
              <Link to="/" className="text-xl font-medium" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/booking" className="text-xl font-medium" onClick={() => setIsMenuOpen(false)}>
                Book Now
              </Link>
              <Link to="/admin" className="text-xl font-medium" onClick={() => setIsMenuOpen(false)}>
                Admin
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar

