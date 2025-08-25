"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { sampleRequests } from "@/lib/sample-data"
import { useToast } from "@/hooks/use-toast"
import { Plus, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const [title, setTitle] = useState("")
  const [purpose, setPurpose] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [urgency, setUrgency] = useState("")
  const { toast } = useToast()

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !purpose || !quantity || !unit || !category || !urgency) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Request Submitted",
      description: "Your donation request has been submitted successfully.",
    })

    // Reset form
    setTitle("")
    setPurpose("")
    setQuantity("")
    setUnit("")
    setDescription("")
    setCategory("")
    setUrgency("")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-golden" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "fulfilled":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-golden/20 text-navy-charcoal border-golden/30"
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "fulfilled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const ongoingRequests = sampleRequests.filter((req) => req.status === "pending" || req.status === "approved")
  const completedRequests = sampleRequests.filter((req) => req.status === "fulfilled" || req.status === "rejected")

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar showBackButton={true} title="My Dashboard" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-navy-charcoal mb-2">My Dashboard</h2>
          <p className="text-navy-medium">Manage your donation requests and track their progress</p>
        </div>

        <Tabs defaultValue="new-request" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-navy-medium/10">
            <TabsTrigger
              value="new-request"
              className="data-[state=active]:bg-golden data-[state=active]:text-navy-charcoal"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </TabsTrigger>
            <TabsTrigger
              value="ongoing"
              className="data-[state=active]:bg-golden data-[state=active]:text-navy-charcoal"
            >
              <Clock className="h-4 w-4 mr-2" />
              Ongoing ({ongoingRequests.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-golden data-[state=active]:text-navy-charcoal"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed ({completedRequests.length})
            </TabsTrigger>
          </TabsList>

          {/* New Request Tab */}
          <TabsContent value="new-request">
            <Card className="border-navy-medium/20">
              <CardHeader>
                <CardTitle className="text-navy-charcoal">Create New Donation Request</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitRequest} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-navy-charcoal">Title *</label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Brief title for your request"
                        className="border-navy-medium/30 focus:border-golden focus:ring-golden/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-navy-charcoal">Category *</label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="border-navy-medium/30 focus:border-golden focus:ring-golden/20">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="children">Children</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-navy-charcoal">Purpose *</label>
                    <Input
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="What is this donation for?"
                      className="border-navy-medium/30 focus:border-golden focus:ring-golden/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-navy-charcoal">Quantity Needed *</label>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0"
                        className="border-navy-medium/30 focus:border-golden focus:ring-golden/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-navy-charcoal">Unit *</label>
                      <Input
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        placeholder="e.g., meals, items, boxes"
                        className="border-navy-medium/30 focus:border-golden focus:ring-golden/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-navy-charcoal">Urgency *</label>
                      <Select value={urgency} onValueChange={setUrgency}>
                        <SelectTrigger className="border-navy-medium/30 focus:border-golden focus:ring-golden/20">
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-navy-charcoal">Description</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide additional details about your request..."
                      rows={4}
                      className="border-navy-medium/30 focus:border-golden focus:ring-golden/20"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-navy-medium hover:bg-navy-dark text-white">
                    Submit Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ongoing Requests Tab */}
          <TabsContent value="ongoing">
            <div className="space-y-4">
              {ongoingRequests.length > 0 ? (
                ongoingRequests.map((request) => (
                  <Card key={request.id} className="border-navy-medium/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-navy-charcoal">{request.title}</h3>
                            <Badge className={getStatusColor(request.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(request.status)}
                                {request.status}
                              </div>
                            </Badge>
                          </div>
                          <p className="text-sm text-navy-medium mb-2">{request.purpose}</p>
                          <p className="text-sm text-muted-foreground mb-3">{request.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              Quantity: {request.quantityNeeded} {request.unit}
                            </span>
                            <span>Category: {request.category}</span>
                            <span>Requested: {new Date(request.dateRequested).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="bg-golden/10 rounded-lg p-2 border border-golden/20">
                            <div className="text-lg font-bold text-navy-charcoal">{request.quantityNeeded}</div>
                            <div className="text-xs text-navy-medium">{request.unit}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-golden mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-navy-charcoal mb-2">No ongoing requests</h3>
                  <p className="text-navy-medium">Your active requests will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Completed Requests Tab */}
          <TabsContent value="completed">
            <div className="space-y-4">
              {completedRequests.length > 0 ? (
                completedRequests.map((request) => (
                  <Card key={request.id} className="border-navy-medium/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-navy-charcoal">{request.title}</h3>
                            <Badge className={getStatusColor(request.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(request.status)}
                                {request.status}
                              </div>
                            </Badge>
                          </div>
                          <p className="text-sm text-navy-medium mb-2">{request.purpose}</p>
                          <p className="text-sm text-muted-foreground mb-3">{request.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              Quantity: {request.quantityNeeded} {request.unit}
                            </span>
                            <span>Category: {request.category}</span>
                            <span>Requested: {new Date(request.dateRequested).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="bg-golden/10 rounded-lg p-2 border border-golden/20">
                            <div className="text-lg font-bold text-navy-charcoal">{request.quantityNeeded}</div>
                            <div className="text-xs text-navy-medium">{request.unit}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-golden mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-navy-charcoal mb-2">No completed requests</h3>
                  <p className="text-navy-medium">Your completed requests will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
