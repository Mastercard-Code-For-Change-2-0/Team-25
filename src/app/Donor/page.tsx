"use client"

import { Navigation } from "@/components/navigation"
import { BackButton } from "@/components/back-button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data for demonstration
const donationItems = {
  approved: [{ id: 3, name: "Medical Supplies", category: "Healthcare", date: "2024-01-12", status: "approved" }],
  pending: [
    { id: 1, name: "Winter Clothes", category: "Clothing", date: "2024-01-15", status: "existing" },
    { id: 2, name: "School Books", category: "Education", date: "2024-01-10", status: "existing" },
    { id: 4, name: "Food Items", category: "Food", date: "2024-01-14", status: "pending" },
    { id: 5, name: "Electronics", category: "Technology", date: "2024-01-13", status: "pending" },
  ],
  rejected: [{ id: 6, name: "Old Furniture", category: "Furniture", date: "2024-01-08", status: "rejected" }],
}

const statusColors = {
  existing: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
}

function DonationCard({ item }: { item: any }) {
  return (
    <Link href={`/donation/${item.id}`}>
      <Card className="mb-4 cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <Badge className={statusColors[item.status as keyof typeof statusColors]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
          </div>
          <CardDescription>
            {item.category} • {item.date}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <BackButton />

      {/* Main Content */}
      <main className="pt-16">
        {/* CTA buttons section */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/Donor/donate">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold">
                  Start Donating
                </Button>
              </Link>
              <Link href="/Donor/requirements">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-lg font-semibold bg-transparent"
                >
                  Open Requirements
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Status Tabs Section */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Your Donation History</h2>

            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-blue-50 border border-blue-200">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {donationItems.pending.map((item) => (
                  <DonationCard key={item.id} item={item} />
                ))}
              </TabsContent>

              <TabsContent value="approved" className="space-y-4">
                {donationItems.approved.map((item) => (
                  <DonationCard key={item.id} item={item} />
                ))}
              </TabsContent>

              <TabsContent value="rejected" className="space-y-4">
                {donationItems.rejected.map((item) => (
                  <DonationCard key={item.id} item={item} />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  )
}
