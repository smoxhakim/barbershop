"use client"

import type React from "react"
import { motion } from "framer-motion"
import Navbar from "./Navbar"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.main
        className="flex-1 container mx-auto px-4 py-8 md:px-6 md:py-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <footer className="py-6 bg-secondary mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Modern Barbershop. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Layout

