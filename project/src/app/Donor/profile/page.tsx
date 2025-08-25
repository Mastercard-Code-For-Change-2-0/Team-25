"use client"

import { Navigation } from "@/components/navigation"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, CreditCard, FileText, Shield, LogOut, Lock, Edit, Check, X, Upload } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Mock user data
const mockUserData = {
  name: "Rajesh Kumar",
  email: "rajesh.kumar@email.com",
  phone: "+91 98765 43210",
  joinDate: "January 2024",
  totalDonations: 12,
  verificationStatus: {
    aadhar: { verified: true, number: "XXXX XXXX 1234" },
    pan: { verified: true, number: "ABCDE1234F" },
    phone: { verified: true },
    email: { verified: true },
  },
}

// Utility function to generate initials
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [formData, setFormData] = useState({
    name: mockUserData.name,
    email: mockUserData.email,
    phone: mockUserData.phone,
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSaveProfile = () => {
    // Handle profile update
    console.log("Profile updated:", formData)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setFormData({
      name: mockUserData.name,
      email: mockUserData.email,
      phone: mockUserData.phone,
    })
    setIsEditing(false)
  }

  const handleChangePassword = () => {
    // Handle password change
    console.log("Password change requested")
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setShowChangePassword(false)
  }

  const handleLogout = () => {
    // Handle logout
    console.log("User logged out")
    router.push("/")
  }

  const handleFileUpload = (documentType: string) => {
    // Handle document upload
    console.log("Upload document:", documentType)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <BackButton />

      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {getInitials(mockUserData.name)}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Profile</h1>
            <p className="text-lg text-muted-foreground">Manage your account information and verification status</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleSaveProfile}>
                        <Check className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    <p className="text-foreground font-medium">{formData.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        className="flex-1"
                      />
                    ) : (
                      <p className="text-foreground font-medium flex-1">{formData.email}</p>
                    )}
                    {mockUserData.verificationStatus.email.verified && (
                      <Badge className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        className="flex-1"
                      />
                    ) : (
                      <p className="text-foreground font-medium flex-1">{formData.phone}</p>
                    )}
                    {mockUserData.verificationStatus.phone.verified && (
                      <Badge className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Member Since</p>
                    <p className="font-medium">{mockUserData.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Donations</p>
                    <p className="font-medium">{mockUserData.totalDonations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ID Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  ID Verification
                </CardTitle>
                <CardDescription>Verify your identity to build trust with the community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Aadhar Card */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Aadhar Card</p>
                      <p className="text-sm text-muted-foreground">
                        {mockUserData.verificationStatus.aadhar.verified
                          ? mockUserData.verificationStatus.aadhar.number
                          : "Not uploaded"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {mockUserData.verificationStatus.aadhar.verified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleFileUpload("aadhar")}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    )}
                  </div>
                </div>

                {/* PAN Card */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">PAN Card</p>
                      <p className="text-sm text-muted-foreground">
                        {mockUserData.verificationStatus.pan.verified
                          ? mockUserData.verificationStatus.pan.number
                          : "Not uploaded"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {mockUserData.verificationStatus.pan.verified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleFileUpload("pan")}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    )}
                  </div>
                </div>

                {/* Driving License */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Driving License</p>
                      <p className="text-sm text-muted-foreground">Optional verification</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleFileUpload("license")}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!showChangePassword ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                  </div>
                  <Button variant="outline" onClick={() => setShowChangePassword(true)}>
                    Change Password
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleChangePassword}>Update Password</Button>
                    <Button variant="ghost" onClick={() => setShowChangePassword(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Logout Section */}
          <Card className="mt-8 border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-destructive">Logout</p>
                  <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
                </div>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
