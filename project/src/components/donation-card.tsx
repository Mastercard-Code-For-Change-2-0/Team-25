"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, User } from "lucide-react"
import type { Donation } from "@/lib/sample-data"

interface DonationCardProps {
  donation: Donation
  onRequest: (donationId: string) => void
}

export function DonationCard({ donation, onRequest }: DonationCardProps) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-golden/20 text-navy-charcoal border-golden/30"
      case "low":
        return "bg-navy-medium/10 text-navy-dark border-navy-medium/20"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="h-full flex flex-col border-navy-medium/20 hover:border-golden/50 transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold text-navy-charcoal line-clamp-2">{donation.title}</CardTitle>
          <Badge className={`${getUrgencyColor(donation.urgency)} text-xs font-medium`}>{donation.urgency}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{donation.purpose}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <div className="bg-golden/10 rounded-lg p-3 border border-golden/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-navy-charcoal">{donation.quantity}</div>
            <div className="text-sm text-navy-medium font-medium">{donation.unit}</div>
          </div>
        </div>

        <p className="text-sm text-foreground line-clamp-3">{donation.description}</p>

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{donation.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{donation.donorName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(donation.datePosted).toLocaleDateString()}</span>
          </div>
        </div>

        <Badge variant="outline" className="w-fit text-xs border-navy-medium/30 text-navy-medium">
          {donation.category}
        </Badge>
      </CardContent>

      <CardFooter className="pt-3">
        <Button
          onClick={() => onRequest(donation.id)}
          className="w-full bg-navy-medium hover:bg-navy-dark text-white font-medium"
        >
          Request Donation
        </Button>
      </CardFooter>
    </Card>
  )
}
