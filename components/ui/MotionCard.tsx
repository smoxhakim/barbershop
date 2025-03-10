"use client"

import type React from "react"
import { motion, type MotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface MotionCardProps extends MotionProps {
  children: React.ReactNode
  className?: string
}

const MotionCard: React.FC<MotionCardProps> = ({ children, className, ...motionProps }) => {
  return (
    <motion.div
      className={cn("bg-card border rounded-lg shadow-sm backdrop-blur-sm bg-opacity-80 p-6", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

export default MotionCard

