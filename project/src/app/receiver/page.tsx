"use client"

import { useState } from "react"
import { DonationCard } from "@/components/donation-card"
import { Pagination } from "@/components/pagination"
import { CategoryFilter } from "@/components/category-filter"
import { Navbar } from "@/components/navbar"
import { sampleDonations } from "@/lib/sample-data"
import { useToast } from "@/hooks/use-toast"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const ITEMS_PER_PAGE = 6

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const { toast } = useToast()

  const filteredDonations = sampleDonations.filter((donation) => {
    const matchesSearch =
      donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "All" || donation.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredDonations.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentDonations = filteredDonations.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleRequest = (donationId: string) => {
    const donation = sampleDonations.find((d) => d.id === donationId)
    toast({
      title: "Request Submitted",
      description: `Your request for "${donation?.title}" has been submitted successfully.`,
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-6">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search donations..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 border-navy-medium/30 focus:border-golden focus:ring-golden/20"
              />
            </div>
          </div>
        </div>

        <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />

        {/* Stats */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-navy-charcoal mb-2">Available Donations</h2>
          <p className="text-navy-medium">
            {filteredDonations.length} donation{filteredDonations.length !== 1 ? "s" : ""} available
            {selectedCategory !== "All" && <span className="text-golden font-medium"> in {selectedCategory}</span>}
          </p>
        </div>

        {/* Donations Grid */}
        {currentDonations.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentDonations.map((donation) => (
                <DonationCard key={donation.id} donation={donation} onRequest={handleRequest} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-golden/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-golden" />
            </div>
            <h3 className="text-lg font-semibold text-navy-charcoal mb-2">No donations found</h3>
            <p className="text-navy-medium">
              Try adjusting your search terms
              {selectedCategory !== "All" && " or selecting a different category"}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
