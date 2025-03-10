"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const HeroSection: React.FC = () => {
  return (
    <section className="py-12 md:py-20 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <motion.div
        className="flex flex-col items-center text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          Experience the Art of <br className="hidden sm:block" />
          <span className="text-primary">Modern Grooming</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Link
            to="/booking"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-md font-medium transition-colors text-lg"
          >
            Book Now
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection

