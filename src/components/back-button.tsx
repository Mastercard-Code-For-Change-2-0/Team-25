"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function BackButton() {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className="absolute top-4 left-4 z-10 hover:bg-blue-50"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
  )
}
