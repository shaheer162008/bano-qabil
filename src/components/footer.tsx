import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { Github, Linkedin } from 'lucide-react'

const Footer = () => {
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Generate ID", href: "/generate-id" },
    { name: "Admin Login", href: "/admin" },
  ]

  const socialLinks = [
    { 
      icon: <Github className="h-5 w-5" />, 
      href: "https://github.com/yourusername",
      label: "GitHub"
    },
    { 
      icon: <Linkedin className="h-5 w-5" />, 
      href: "https://linkedin.com/in/yourusername",
      label: "LinkedIn"
    },
  ]

  return (
    <footer className="w-full border-t bg-white">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="Bano Qabil Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-lg font-semibold">Bano Qabil</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              Empowering individuals through quality education and skill development
              for a brighter future.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Connect With Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{link.label}</span>
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        
        {/* Copyright */}
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Bano Qabil. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer