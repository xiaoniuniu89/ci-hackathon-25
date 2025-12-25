import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/recipes', label: 'Recipes' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <nav className="navbar border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <NavLink to="/" className="text-white font-script text-xl no-underline hover:text-antique-gold transition-colors">
              Merry Meals
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `text-white hover:text-antique-gold transition-colors no-underline ${
                      isActive ? 'text-antique-gold' : ''
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Mobile Navigation - Sheet Component */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-white hover:text-antique-gold hover:bg-transparent"
                  aria-label="Toggle navigation"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="sr-only">
                  <h2>Navigation Menu</h2>
                </div>
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.to}>
                      <NavLink
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                          `text-lg font-medium transition-colors hover:text-primary ${
                            isActive ? 'text-primary' : 'text-foreground'
                          }`
                        }
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </NavLink>
                    </SheetClose>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Header
