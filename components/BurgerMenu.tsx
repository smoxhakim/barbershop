"use client"

import { useState, useEffect } from "react"
import { slide as Menu } from 'react-burger-menu'
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavLink {
  href: string
  label: string
}

interface State {
  isOpen: boolean
}

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/booking", label: "Book Appointment" },
  { href: "/admin", label: "Admin" },
]

const BurgerMenu = () => {
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

  const styles = {
    bmBurgerButton: {
      position: 'fixed',
      width: '36px',
      height: '30px',
      right: '20px',
      top: '20px',
    },
    bmBurgerBars: {
      background: '#3B82F6'
    },
    bmBurgerBarsHover: {
      background: '#2563EB'
    },
    bmCrossButton: {
      height: '24px',
      width: '24px',
      right: '20px',
      top: '20px',
    },
    bmCross: {
      background: '#3B82F6'
    },
    bmMenuWrap: {
      position: 'fixed',
      height: '100vh',
      top: '0',
      right: '0',
      width: '100%',
      maxWidth: '320px'
    },
    bmMenu: {
      background: '#0F172A',
      height: '100vh',
      padding: '4rem 0 0 0',
    },
    bmMorphShape: {
      fill: '#0F172A'
    },
    bmItemList: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '0 1.5rem'
    },
    bmItem: {
      display: 'inline-block',
    },
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(4px)',
      top: '0',
      left: '0'
    }
  }

  return (
    <div className="md:hidden">
      <Menu 
        right
        isOpen={isOpen}
        onStateChange={(state: State) => setIsOpen(state.isOpen)}
        styles={styles}
        width={'100%'}
        className="md:hidden"
      >
        <div className="h-full flex flex-col">
          <nav className="flex flex-col space-y-4 mt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-3 px-4 text-lg rounded-md transition-colors ${
                  pathname === link.href
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto mb-8 pt-6 border-t border-gray-800 text-sm text-gray-400">
            <p>
              Modern Cuts Barbershop
              <br />
              123 Main Street
              <br />
              Open Mon-Sat: 9AM - 8PM
            </p>
          </div>
        </div>
      </Menu>
    </div>
  )
}

export default BurgerMenu 