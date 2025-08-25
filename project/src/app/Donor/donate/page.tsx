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
import { Upload, X, Plus, Minus, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDonations } from "@/hooks/useDonations"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const categories = [
  "Education",
  "Healthcare", 
  "Food",
  "Clothing",
  "Technology",
  "Furniture",
  "Other",
]

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Chandigarh", "Dadra and Nagar Haveli",
  "Daman and Diu", "Lakshadweep", "Puducherry"
]

interface DonationItem {
  name: string
  quantity: number
  description: string
}

export default function DonatePage() {
  const router = useRouter()
  const { createDonation } = useDonations()
  
  const [donationType, setDonationType] = useState<"monetary" | "material">("material")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    amount: "",
    urgency: "medium",
    state: "",
    city: "",
    pincode: "",
    address: "",
    deadline: "",
  })
  
  const [items, setItems] = useState<DonationItem[]>([
    { name: "", quantity: 1, description: "" }
  ])
  
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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

  const addItem = () => {
    setItems(prev => [...prev, { name: "", quantity: 1, description: "" }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof DonationItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ))
  }

  const validateForm = () => {
    if (!formData.title.trim()) return "Title is required"
    if (!formData.description.trim()) return "Description is required"
    if (!formData.category) return "Category is required"
    if (!formData.state) return "State is required"
    if (!formData.city.trim()) return "City is required"
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) return "Valid 6-digit pincode is required"
    if (!formData.deadline) return "Deadline is required"
    
    // Check if deadline is in the future
    if (new Date(formData.deadline) <= new Date()) return "Deadline must be in the future"
    
    if (donationType === "monetary") {
      if (!formData.amount || parseFloat(formData.amount) <= 0) return "Valid amount is required"
    } else {
      // Validate items
      if (items.some(item => !item.name.trim() || item.quantity <= 0)) {
        return "All items must have a name and quantity greater than 0"
      }
    }
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate form
      const validationError = validateForm()
      if (validationError) {
        setError(validationError)
        return
      }

      // Prepare donation data
      const donationData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        type: donationType,
        amount: donationType === "monetary" ? parseFloat(formData.amount) : undefined,
        items: donationType === "material" ? items.filter(item => item.name.trim()) : undefined,
        urgency: formData.urgency,
        location: {
          state: formData.state,
          city: formData.city.trim(),
          address: formData.address.trim() || undefined,
          pincode: formData.pincode.trim(),
        },
        deadline: formData.deadline,
        // Note: In a real app, you'd upload images to a service first
        images: selectedImages.map(file => file.name), // Placeholder
      }

      const success = await createDonation(donationData)
      
      if (success) {
        setSuccess(true)
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "",
          amount: "",
          urgency: "medium",
          state: "",
          city: "",
          pincode: "",
          address: "",
          deadline: "",
        })
        setItems([{ name: "", quantity: 1, description: "" }])
        setSelectedImages([])
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push("/Donor")
        }, 2000)
      }
    } catch (err) {
      setError("Failed to create donation. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton href="/Donor" />
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Create New Donation
              </CardTitle>
              <CardDescription>
                Share your resources with those in need. Choose between monetary or material donations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Donation created successfully! Redirecting to dashboard...
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Donation Type Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Donation Type</Label>
                  <RadioGroup
                    value={donationType}
                    onValueChange={(value: "monetary" | "material") => setDonationType(value)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="material" id="material" />
                      <Label htmlFor="material">Material Donation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monetary" id="monetary" />
                      <Label htmlFor="monetary">Monetary Donation</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Brief title for your donation"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your donation in detail..."
                    rows={4}
                    required
                  />
                </div>

                {/* Conditional Fields Based on Donation Type */}
                {donationType === "monetary" ? (
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₹) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Items to Donate</Label>
                      <Button type="button" onClick={addItem} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Item
                      </Button>
                    </div>
                    
                    {items.map((item, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Item Name *</Label>
                              <Input
                                value={item.name}
                                onChange={(e) => updateItem(index, "name", e.target.value)}
                                placeholder="e.g., Winter Jacket"
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Quantity *</Label>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Input
                                value={item.description}
                                onChange={(e) => updateItem(index, "description", e.target.value)}
                                placeholder="Condition, size, etc."
                              />
                            </div>
                          </div>
                          
                          {items.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(index)}
                              className="mt-7"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Urgency and Deadline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select 
                      value={formData.urgency} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Available Until *</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Location Details</Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select 
                        value={formData.state} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Enter city"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                        placeholder="6-digit pincode"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address (Optional)</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Detailed address for pickup/delivery"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Images (Optional)</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drop images here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button type="button" variant="outline" className="mt-4" asChild>
                        <span>Browse Files</span>
                      </Button>
                    </label>
                  </div>

                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Donation..." : "Create Donation"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/Donor")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
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
      </div>
    </div>
  )
}
