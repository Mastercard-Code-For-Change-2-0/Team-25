"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Plus, Minus } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const categories = [
  "Clothing",
  "Electronics",
  "Books/Educational Materials",
  "Furniture",
  "Food Items",
  "Medical Supplies",
  "Toys/Games",
  "Other",
]

const conditions = [
  { value: "very-good", label: "Very Good", color: "bg-green-100 text-green-800" },
  { value: "good", label: "Good", color: "bg-blue-100 text-blue-800" },
  { value: "fair", label: "Fair", color: "bg-yellow-100 text-yellow-800" },
  { value: "poor", label: "Poor", color: "bg-red-100 text-red-800" },
]

export default function DonatePage() {
  const [quantity, setQuantity] = useState(1)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [formData, setFormData] = useState({
    category: "",
    itemName: "",
    description: "",
    condition: "",
    location: "",
  })
  const router = useRouter()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
      setSelectedImages((prev) => [...prev, ...files])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"))
      setSelectedImages((prev) => [...prev, ...files])
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create new donation entry
    const newDonation = {
      id: Date.now(),
      name: formData.itemName,
      category: formData.category,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      quantity,
      description: formData.description,
      condition: formData.condition,
      location: formData.location,
      images: selectedImages,
    }

    // In a real app, this would be sent to an API
    console.log("New donation submitted:", newDonation)

    // Show success message and redirect to home
    alert("Donation submitted successfully! It has been added to your pending donations.")
    router.push("/")
  }

  const handleSaveDraft = () => {
    // Handle save as draft
    console.log("Saved as draft:", { ...formData, quantity, selectedImages })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <BackButton />

      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Start Donating</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fill out the form below to donate items to those in need. Your generosity makes a difference.
            </p>
          </div>

          {/* Donation Form */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle>Donation Details</CardTitle>
              <CardDescription>Please provide accurate information about the items you wish to donate.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Item Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Item Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase().replace(/[^a-z0-9]/g, "-")}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Item Name */}
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name *</Label>
                  <Input
                    id="itemName"
                    placeholder="e.g., Winter Jacket, Mathematics Textbook"
                    value={formData.itemName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, itemName: e.target.value }))}
                    required
                  />
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="w-20 text-center"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about the item(s), including size, color, brand, etc."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                {/* Condition */}
                <div className="space-y-4">
                  <Label>Condition *</Label>
                  <RadioGroup
                    value={formData.condition}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, condition: value }))}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
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
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Mumbai, Maharashtra"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <Label>Images</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">Drag and drop images here</p>
                    <p className="text-muted-foreground mb-4">or</p>
                    <Button type="button" variant="outline" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Choose Files
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    </Button>
                  </div>

                  {/* Image Previews */}
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button type="submit" className="flex-1">
                    Submit Donation
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="flex-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  >
                    Save as Draft
                  </Button>
                  <Link href="/" className="flex-1">
                    <Button type="button" variant="ghost" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
