"use client"

import { Navigation } from "@/components/navigation"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Phone, Mail, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

// Mock data for requirements
const mockRequirements = [
  {
    id: 1,
    organizationName: "Sunshine Orphanage",
    organizationType: "NGO",
    requiredItems: "Winter clothes for children (ages 5-15)",
    urgency: "high",
    location: "Mumbai, Maharashtra",
    contact: {
      phone: "+91 98765 43210",
      email: "contact@sunshineorphanage.org",
    },
    postedDate: "2024-01-15",
    description:
      "We urgently need warm clothing for 50 children as winter approaches. Jackets, sweaters, and blankets are most needed.",
  },
  {
    id: 2,
    organizationName: "St. Mary's School",
    organizationType: "School",
    requiredItems: "Educational books and stationery",
    urgency: "medium",
    location: "Pune, Maharashtra",
    contact: {
      phone: "+91 87654 32109",
      email: "principal@stmarysschool.edu",
    },
    postedDate: "2024-01-12",
    description: "Looking for textbooks, notebooks, and writing materials for underprivileged students in grades 1-10.",
  },
  {
    id: 3,
    organizationName: "Golden Years Home",
    organizationType: "Old Age Home",
    requiredItems: "Medical supplies and wheelchairs",
    urgency: "high",
    location: "Delhi, NCR",
    contact: {
      phone: "+91 76543 21098",
      email: "admin@goldenyearshome.org",
    },
    postedDate: "2024-01-10",
    description:
      "We need medical equipment and mobility aids for our elderly residents. Blood pressure monitors and wheelchairs are priority items.",
  },
  {
    id: 4,
    organizationName: "Hope Hostel",
    organizationType: "Hostel",
    requiredItems: "Furniture and bedding",
    urgency: "low",
    location: "Bangalore, Karnataka",
    contact: {
      phone: "+91 65432 10987",
      email: "manager@hopehostel.com",
    },
    postedDate: "2024-01-08",
    description: "Expanding our facility and need beds, mattresses, study tables, and chairs for new residents.",
  },
  {
    id: 5,
    organizationName: "Community Care Center",
    organizationType: "Community Home",
    requiredItems: "Food items and kitchen equipment",
    urgency: "medium",
    location: "Chennai, Tamil Nadu",
    contact: {
      phone: "+91 54321 09876",
      email: "info@communitycare.org",
    },
    postedDate: "2024-01-14",
    description:
      "Setting up a community kitchen to serve meals to homeless individuals. Need cooking utensils, gas stoves, and non-perishable food items.",
  },
]

const organizationTypes = ["All", "NGO", "School", "Hostel", "Old Age Home", "Community Home"]

const urgencyColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
}

const orgTypeColors = {
  NGO: "bg-blue-100 text-blue-800",
  School: "bg-purple-100 text-purple-800",
  Hostel: "bg-orange-100 text-orange-800",
  "Old Age Home": "bg-pink-100 text-pink-800",
  "Community Home": "bg-teal-100 text-teal-800",
}

export default function RequirementsPage() {
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set())

  const filteredRequirements = mockRequirements
    .filter((req) => {
      const matchesFilter = selectedFilter === "All" || req.organizationType === selectedFilter
      const matchesSearch =
        searchQuery === "" ||
        req.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.requiredItems.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.location.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "urgency":
          const urgencyOrder = { high: 3, medium: 2, low: 1 }
          return (
            urgencyOrder[b.urgency as keyof typeof urgencyOrder] - urgencyOrder[a.urgency as keyof typeof urgencyOrder]
          )
        case "location":
          return a.location.localeCompare(b.location)
        case "organization":
          return a.organizationName.localeCompare(b.organizationName)
        default: // date
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      }
    })

  const handleRespond = (requirementId: number) => {
    console.log("Responding to requirement:", requirementId)
    // Handle response logic here
  }

  const toggleDescription = (id: number) => {
    const newExpanded = new Set(expandedDescriptions)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedDescriptions(newExpanded)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <BackButton />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Requirements</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover organizations in need and make a direct impact by responding to their specific requirements.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {organizationTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedFilter === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(type)}
                  className={`rounded-full ${selectedFilter !== type ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" : ""}`}
                >
                  {type}
                </Button>
              ))}
              {selectedFilter !== "All" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFilter("All")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search requirements, organizations, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Latest First</SelectItem>
                  <SelectItem value="urgency">Urgency</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="organization">Organization</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Requirements Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRequirements.map((requirement) => (
              <Card key={requirement.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-400">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg leading-tight">{requirement.organizationName}</CardTitle>
                    <Badge className={urgencyColors[requirement.urgency as keyof typeof urgencyColors]}>
                      <Clock className="h-3 w-3 mr-1" />
                      {requirement.urgency.charAt(0).toUpperCase() + requirement.urgency.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={orgTypeColors[requirement.organizationType as keyof typeof orgTypeColors]}>
                      {requirement.organizationType}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {requirement.location}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Required Items:</h4>
                    <p className="text-sm text-muted-foreground">{requirement.requiredItems}</p>
                  </div>

                  <div>
                    <p
                      className={`text-sm text-muted-foreground ${
                        !expandedDescriptions.has(requirement.id) ? "line-clamp-3" : ""
                      }`}
                    >
                      {requirement.description}
                    </p>
                    {requirement.description.length > 150 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDescription(requirement.id)}
                        className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-800"
                      >
                        {expandedDescriptions.has(requirement.id) ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            View Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            View More
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="h-3 w-3 mr-2" />
                      {requirement.contact.phone}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="h-3 w-3 mr-2" />
                      {requirement.contact.email}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={() => handleRespond(requirement.id)}
                      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                    >
                      Respond to Requirement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredRequirements.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No requirements found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFilter("All")
                  setSearchQuery("")
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
