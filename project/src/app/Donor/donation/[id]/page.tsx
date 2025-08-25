"use client"

import { Navigation } from "@/components/navigation"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useParams } from "next/navigation"

// Mock data for demonstration - in real app this would come from API
const mockDonationData = {
  1: {
    id: 1,
    name: "Winter Clothes",
    category: "clothing",
    quantity: 5,
    description:
      "Warm winter jackets and sweaters for children aged 8-12. All items are in good condition and have been cleaned.",
    condition: "good",
    location: "Mumbai, Maharashtra",
    status: "existing",
    date: "2024-01-15",
    images: ["/winter-clothes.png"],
  },
  2: {
    id: 2,
    name: "School Books",
    category: "books-educational-materials",
    quantity: 10,
    description: "Mathematics and Science textbooks for grades 6-8. Some highlighting but all pages intact.",
    condition: "fair",
    location: "Pune, Maharashtra",
    status: "existing",
    date: "2024-01-10",
    images: ["/placeholder-t7dhc.png"],
  },
  3: {
    id: 3,
    name: "Medical Supplies",
    category: "medical-supplies",
    quantity: 1,
    description:
      "First aid kit with bandages, antiseptic, and basic medical supplies. All items are unused and within expiry date.",
    condition: "very-good",
    location: "Delhi, NCR",
    status: "approved",
    date: "2024-01-12",
    images: ["/placeholder-aunwp.png"],
  },
  4: {
    id: 4,
    name: "Food Items",
    category: "food-items",
    quantity: 20,
    description:
      "Non-perishable food items including rice, dal, and canned goods. All items are well within expiry dates.",
    condition: "very-good",
    location: "Chennai, Tamil Nadu",
    status: "pending",
    date: "2024-01-14",
    images: ["/placeholder-0fyqr.png"],
  },
  5: {
    id: 5,
    name: "Electronics",
    category: "electronics",
    quantity: 2,
    description: "Old laptops that have been refurbished. Both are in working condition with chargers included.",
    condition: "good",
    location: "Bangalore, Karnataka",
    status: "pending",
    date: "2024-01-13",
    images: ["/placeholder-8co8n.png"],
  },
  6: {
    id: 6,
    name: "Old Furniture",
    category: "furniture",
    quantity: 3,
    description: "Wooden chairs and a small table. Some wear and tear but still functional.",
    condition: "poor",
    location: "Kolkata, West Bengal",
    status: "rejected",
    date: "2024-01-08",
    images: ["/rustic-wooden-furniture.png"],
  },
}

const categories = [
  { value: "clothing", label: "Clothing" },
  { value: "electronics", label: "Electronics" },
  { value: "books-educational-materials", label: "Books/Educational Materials" },
  { value: "furniture", label: "Furniture" },
  { value: "food-items", label: "Food Items" },
  { value: "medical-supplies", label: "Medical Supplies" },
  { value: "toys-games", label: "Toys/Games" },
  { value: "other", label: "Other" },
]

const conditions = [
  { value: "very-good", label: "Very Good", color: "bg-green-100 text-green-800" },
  { value: "good", label: "Good", color: "bg-blue-100 text-blue-800" },
  { value: "fair", label: "Fair", color: "bg-yellow-100 text-yellow-800" },
  { value: "poor", label: "Poor", color: "bg-red-100 text-red-800" },
]

const statusColors = {
  existing: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
}

export default function DonationDetailPage() {
  const params = useParams()
  const donationId = Number(params.id)
  const donation = mockDonationData[donationId as keyof typeof mockDonationData]

  if (!donation) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <BackButton />
        <main className="pt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Donation Not Found</h1>
            <p className="text-muted-foreground">The donation you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    )
  }

  const selectedCategory = categories.find((cat) => cat.value === donation.category)
  const selectedCondition = conditions.find((cond) => cond.value === donation.condition)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <BackButton />

      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Donation Details</h1>
              <Badge className={statusColors[donation.status as keyof typeof statusColors]}>
                {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">Submitted on {donation.date}</p>
          </div>

          {/* Donation Form - Read Only */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle>Donation Information</CardTitle>
              <CardDescription>This is a read-only view of the submitted donation form.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Item Category */}
                <div className="space-y-2">
                  <Label>Item Category</Label>
                  <Select value={donation.category} disabled>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={donation.category}>{selectedCategory?.label || donation.category}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Item Name */}
                <div className="space-y-2">
                  <Label>Item Name</Label>
                  <Input value={donation.name} disabled />
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input value={donation.quantity} disabled className="w-20" />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={donation.description} disabled rows={4} />
                </div>

                {/* Condition */}
                <div className="space-y-4">
                  <Label>Condition</Label>
                  <RadioGroup value={donation.condition} disabled className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {conditions.map((condition) => (
                      <div key={condition.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={condition.value} id={condition.value} />
                        <Label htmlFor={condition.value} className="cursor-pointer">
                          <Badge className={condition.color}>{condition.label}</Badge>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={donation.location} disabled />
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <Label>Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {donation.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Donation image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
