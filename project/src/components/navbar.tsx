"use client"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavbarProps {
  showBackButton?: boolean
  title?: string
}

export function Navbar({ showBackButton = false, title }: NavbarProps) {
  return (
    <header className="bg-white border-b border-navy-medium/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-navy-medium hover:text-navy-charcoal hover:bg-golden/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            )}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/seva-sahayog-logo.png"
                alt="Seva Sahayog - Celebrating Humanity"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-navy-charcoal">Seva Sahyog</h1>
                {title && <p className="text-sm text-navy-medium">{title}</p>}
              </div>
            </Link>
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="w-10 h-10 bg-navy-charcoal rounded-full flex items-center justify-center cursor-pointer hover:bg-navy-dark transition-colors">
                  <User className="h-5 w-5 text-white" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-navy-medium">
                <DropdownMenuItem asChild>
                  <Link href="/receiver/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    My Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-navy-medium/20" />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
