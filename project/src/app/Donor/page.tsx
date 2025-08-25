"use client"

import { Navigation } from "@/components/navigation"
import { BackButton } from "@/components/back-button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useDonations } from "@/hooks/useDonations"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AuthService, { User } from "@/lib/authService"
import Link from "next/link"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-gray-100 text-gray-800",
}

function DonationCard({ item }: { item: any }) {
  return (
    <Link href={`/Donor/donation/${item._id}`}>
      <Card className="mb-4 cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <Badge className={statusColors[item.status as keyof typeof statusColors]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
          </div>
          <CardDescription>
            {item.category} • {new Date(item.createdAt).toLocaleDateString()}
            {item.amount && ` • ₹${item.amount}`}
            {item.items && ` • ${item.items.length} items`}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [currentUser, setCurrentUser] = useState<string>("")
  const [loading, setLoading] = useState(true)

  // Fetch user's donations
  const { donations, loading: donationsLoading, error } = useDonations({
    donorId: currentUser,
  })

  useEffect(() => {
    const checkAuth = async () => {
      const userData = await AuthService.getCurrentUser()
      if (!userData) {
        router.push("/auth/login")
        return
      }
      if (userData.role !== "donor") {
        const dashboardRoute = AuthService.getDashboardRoute(userData.role)
        router.push(dashboardRoute)
        return
      }
      setUser(userData)
      setCurrentUser(userData.id)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  // Group donations by status
  const donationsByStatus = {
    pending: donations.filter(d => d.status === "pending"),
    approved: donations.filter(d => d.status === "approved"),
    rejected: donations.filter(d => d.status === "rejected"),
    completed: donations.filter(d => d.status === "completed"),
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <BackButton />

      {/* Main Content */}
      <main className="pt-16">
        {/* Welcome Section */}
        <section className="py-8 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome back, {user.email}!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Continue making a difference in the lives of those who need it most.
            </p>
          </div>
        </section>

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
                  View Requirements
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="text-center p-4">
                <h3 className="text-2xl font-bold text-primary">{donations.length}</h3>
                <p className="text-gray-600">Total Donations</p>
              </Card>
              <Card className="text-center p-4">
                <h3 className="text-2xl font-bold text-green-600">{donationsByStatus.approved.length}</h3>
                <p className="text-gray-600">Approved</p>
              </Card>
              <Card className="text-center p-4">
                <h3 className="text-2xl font-bold text-yellow-600">{donationsByStatus.pending.length}</h3>
                <p className="text-gray-600">Pending</p>
              </Card>
              <Card className="text-center p-4">
                <h3 className="text-2xl font-bold text-blue-600">{donationsByStatus.completed.length}</h3>
                <p className="text-gray-600">Completed</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Status Tabs Section */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Your Donation History</h2>

            {donationsLoading ? (
              <div className="text-center py-8">
                <div className="text-lg">Loading donations...</div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-600">{error}</div>
              </div>
            ) : (
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8 bg-blue-50 border border-blue-200">
                  <TabsTrigger value="pending">Pending ({donationsByStatus.pending.length})</TabsTrigger>
                  <TabsTrigger value="approved">Approved ({donationsByStatus.approved.length})</TabsTrigger>
                  <TabsTrigger value="completed">Completed ({donationsByStatus.completed.length})</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected ({donationsByStatus.rejected.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                  {donationsByStatus.pending.length > 0 ? (
                    donationsByStatus.pending.map((item) => (
                      <DonationCard key={item._id} item={item} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No pending donations found.
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="approved" className="space-y-4">
                  {donationsByStatus.approved.length > 0 ? (
                    donationsByStatus.approved.map((item) => (
                      <DonationCard key={item._id} item={item} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No approved donations found.
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                  {donationsByStatus.completed.length > 0 ? (
                    donationsByStatus.completed.map((item) => (
                      <DonationCard key={item._id} item={item} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No completed donations found.
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="rejected" className="space-y-4">
                  {donationsByStatus.rejected.length > 0 ? (
                    donationsByStatus.rejected.map((item) => (
                      <DonationCard key={item._id} item={item} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No rejected donations found.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
