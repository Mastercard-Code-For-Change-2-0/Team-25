"use client"

import { Navigation } from "@/components/navigation"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Calendar, Users, ChevronDown, ChevronUp, Heart } from "lucide-react"
import { useRequirements } from "@/hooks/useRequirements"
import { useState } from "react"

const urgencyColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
}

const categoryColors = {
  Education: "bg-blue-100 text-blue-800",
  Healthcare: "bg-red-100 text-red-800",
  Food: "bg-green-100 text-green-800",
  Clothing: "bg-purple-100 text-purple-800",
  Technology: "bg-gray-100 text-gray-800",
  Furniture: "bg-brown-100 text-brown-800",
  Other: "bg-orange-100 text-orange-800",
}

function RequirementCard({ requirement }: { requirement: any }) {
  const [expanded, setExpanded] = useState(false)

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return "Expired"
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    return `${diffDays} days left`
  }

  const getProgressPercentage = () => {
    if (requirement.type === "monetary" && requirement.targetAmount) {
      return (requirement.currentAmount / requirement.targetAmount) * 100
    }
    return 0
  }

  return (
    <Card className="mb-6 hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{requirement.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={urgencyColors[requirement.urgency as keyof typeof urgencyColors]}>
                {requirement.urgency.toUpperCase()}
              </Badge>
              <Badge className={categoryColors[requirement.category as keyof typeof categoryColors]}>
                {requirement.category}
              </Badge>
              <Badge variant="outline">{requirement.type}</Badge>
              {requirement.adminVerified && (
                <Badge className="bg-green-100 text-green-800">Verified</Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {requirement.location.city}, {requirement.location.state}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDeadline(requirement.deadline)}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {requirement.beneficiaryInfo.count} beneficiaries
              </div>
            </div>
          </div>
          <div className="text-right">
            {requirement.donorsCount > 0 && (
              <div className="text-sm text-gray-600 mb-1">
                {requirement.donorsCount} donors interested
              </div>
            )}
            <Button size="sm">
              <Heart className="h-4 w-4 mr-1" />
              Donate
            </Button>
          </div>
        </div>

        {/* Progress bar for monetary requirements */}
        {requirement.type === "monetary" && requirement.targetAmount && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Raised: ₹{requirement.currentAmount || 0}</span>
              <span>Goal: ₹{requirement.targetAmount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(getProgressPercentage(), 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {getProgressPercentage().toFixed(1)}% funded
            </div>
          </div>
        )}

        {/* Items list for material requirements */}
        {requirement.items && requirement.items.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-sm mb-2">Required Items:</h4>
            <div className="grid grid-cols-2 gap-2">
              {requirement.items.slice(0, 4).map((item: any, index: number) => (
                <div key={index} className="text-sm bg-gray-50 rounded p-2">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-600">
                    Need: {item.quantity} | Received: {item.received || 0}
                  </div>
                </div>
              ))}
              {requirement.items.length > 4 && !expanded && (
                <div className="text-sm text-blue-600 cursor-pointer col-span-2 text-center py-2">
                  +{requirement.items.length - 4} more items
                </div>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-700 mb-4 line-clamp-3">
          {requirement.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Posted by: {requirement.requesterId?.receiverSubtype || "Organization"}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600"
          >
            {expanded ? (
              <>
                Less details <ChevronUp className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                More details <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Beneficiary Information</h4>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Count:</strong> {requirement.beneficiaryInfo.count}
                </p>
                {requirement.beneficiaryInfo.ageGroup && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Age Group:</strong> {requirement.beneficiaryInfo.ageGroup}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  {requirement.beneficiaryInfo.description}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Email:</strong> {requirement.requesterId?.email}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Address:</strong> {requirement.location.address || "Contact for details"}
                </p>
                {requirement.tags && requirement.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {requirement.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function RequirementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedUrgency, setSelectedUrgency] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const { requirements, loading, error } = useRequirements({
    category: selectedCategory || undefined,
    urgency: selectedUrgency || undefined,
    state: selectedState || undefined,
    verified: verifiedOnly,
    limit: 20,
  })

  // Filter requirements based on search term
  const filteredRequirements = requirements.filter(req =>
    req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <BackButton />

      <main className="pt-16">
        {/* Header */}
        <section className="py-8 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Community Requirements
            </h1>
            <p className="text-lg text-gray-600">
              Discover opportunities to make a meaningful impact in your community
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search requirements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                <SelectTrigger>
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Urgencies</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All States</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                  <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="Gujarat">Gujarat</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={verifiedOnly ? "default" : "outline"}
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className="whitespace-nowrap"
              >
                Verified Only
              </Button>
            </div>
          </div>
        </section>

        {/* Requirements List */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-lg">Loading requirements...</div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600">{error}</div>
              </div>
            ) : filteredRequirements.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-600">No requirements found matching your criteria.</div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {filteredRequirements.length} Requirements Found
                  </h2>
                  <div className="text-sm text-gray-600">
                    Showing {filteredRequirements.length} of {requirements.length} total
                  </div>
                </div>

                <div className="space-y-6">
                  {filteredRequirements.map((requirement) => (
                    <RequirementCard key={requirement._id} requirement={requirement} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
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
