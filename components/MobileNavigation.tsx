"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Sling as Hamburger } from "hamburger-react"
import { Scissors, Home, Calendar, User, MapPin, Clock } from "lucide-react"
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface NavLink {
  href: string
  label: string
  icon: React.ReactNode
}

const navLinks: NavLink[] = [
  { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
  { href: "/booking", label: "Book Appointment", icon: <Calendar className="h-5 w-5" /> },
  { href: "/admin", label: "Admin", icon: <User className="h-5 w-5" /> },
]

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const menuItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    exit: { opacity: 0, x: 20 }
  }

  const contactInfoVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { opacity: 0, y: 20 }
  }

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild aria-label="Toggle menu">
          <div className="flex items-center justify-center z-50 relative">
            <Hamburger 
              toggled={isOpen} 
              toggle={setIsOpen} 
              size={20} 
              color="#3B82F6"
              label="Toggle menu"
              rounded
            />
          </div>
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className="bg-background/95 backdrop-blur-md border-l border-border/50 p-0 w-full max-w-[300px] shadow-xl"
        >
          <div className="h-full flex flex-col p-6">
            <SheetHeader className="mb-6 mt-2">
              <SheetTitle className="flex items-center gap-2">
                <Scissors className="h-6 w-6 text-primary" />
                <span className="font-medium text-xl">Modern Cuts</span>
              </SheetTitle>
            </SheetHeader>
            
            <AnimatePresence>
              {isOpen && (
                <motion.nav 
                  className="flex flex-col space-y-2"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      custom={i}
                      variants={menuItemVariants}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center gap-3 py-3 px-4 text-base rounded-md transition-all
                          ${pathname === link.href 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-foreground hover:bg-accent hover:text-accent-foreground"
                          }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </motion.nav>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  className="mt-auto pt-6 border-t border-border/50 text-sm text-muted-foreground"
                  variants={contactInfoVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                    <p>
                      Modern Cuts Barbershop
                      <br />
                      123 Main Street
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <p>Open Mon-Sat: 9AM - 8PM</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNavigation