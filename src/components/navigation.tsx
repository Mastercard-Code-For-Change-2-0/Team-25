"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"

export function Navigation() {
  const router = useRouter()
  const pathname = usePathname()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Text */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="hover:bg-gray-100 p-2 rounded-lg transition-colors">
                <Image
                  src="/images/seva-sahyog-logo.png"
                  alt="Seva Sahyog - Celebrating Humanity"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-[#19486A]">Seva Sahyog</h1>
          </div>

          {/* Right side - Back Button and Profile */}
          <div className="flex items-center space-x-2">
            {pathname !== "/" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="flex items-center space-x-2 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            )}

            <Link href="/profile">
              <Button variant="ghost" size="sm" className="rounded-full p-2 hover:bg-gray-100">
                <Avatar className="h-8 w-8 ring-2 ring-gray-200">
                  <AvatarFallback className="bg-[#19486A] text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
