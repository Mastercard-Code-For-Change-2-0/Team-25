import { Donor, Receiver, Match } from "@/types/donations";

export const mockDonors: Donor[] = [
  {
    id: "d1",
    name: "Green Valley Community Center",
    email: "contact@greenvalley.org",
    phone: "+1-555-0123",
    location: "Downtown District",
    items: [
      {
        id: "i1",
        name: "Canned Food",
        quantity: 200,
        unit: "cans",
        description: "Mixed vegetables and fruits",
        donatedAt: new Date("2024-01-15")
      },
      {
        id: "i2", 
        name: "Blankets",
        quantity: 50,
        unit: "pieces",
        description: "Warm winter blankets",
        donatedAt: new Date("2024-01-16")
      }
    ]
  },
  {
    id: "d2",
    name: "Tech Solutions Inc.",
    email: "donations@techsolutions.com",
    phone: "+1-555-0456",
    location: "Business District",
    items: [
      {
        id: "i3",
        name: "Laptops",
        quantity: 15,
        unit: "pieces",
        description: "Refurbished laptops for education",
        donatedAt: new Date("2024-01-17")
      },
      {
        id: "i4",
        name: "School Supplies",
        quantity: 300,
        unit: "sets",
        description: "Complete stationery sets",
        donatedAt: new Date("2024-01-18")
      }
    ]
  },
  {
    id: "d3",
    name: "Fresh Foods Market",
    email: "manager@freshfoods.com", 
    phone: "+1-555-0789",
    location: "Market Square",
    items: [
      {
        id: "i5",
        name: "Fresh Vegetables",
        quantity: 100,
        unit: "kg",
        description: "Seasonal fresh produce",
        donatedAt: new Date("2024-01-19")
      }
    ]
  }
];

export const mockReceivers: Receiver[] = [
  {
    id: "r1",
    name: "Hope Shelter",
    email: "admin@hopeshelter.org",
    phone: "+1-555-1234",
    location: "East District", 
    requestedItems: [
      {
        id: "ri1",
        name: "Blankets",
        quantity: 30,
        unit: "pieces",
        description: "For homeless individuals",
        urgency: "high",
        requestedAt: new Date("2024-01-20")
      },
      {
        id: "ri2",
        name: "Canned Food", 
        quantity: 150,
        unit: "cans",
        description: "Non-perishable meals",
        urgency: "medium",
        requestedAt: new Date("2024-01-21")
      }
    ]
  },
  {
    id: "r2",
    name: "Bright Future School",
    email: "principal@brightfuture.edu",
    phone: "+1-555-5678",
    location: "Suburban Area",
    requestedItems: [
      {
        id: "ri3",
        name: "Laptops",
        quantity: 10,
        unit: "pieces", 
        description: "For computer lab",
        urgency: "medium",
        requestedAt: new Date("2024-01-22")
      },
      {
        id: "ri4",
        name: "School Supplies",
        quantity: 250,
        unit: "sets",
        description: "For underprivileged students",
        urgency: "high",
        requestedAt: new Date("2024-01-23")
      }
    ]
  },
  {
    id: "r3",
    name: "Community Kitchen",
    email: "chef@communitykitchen.org",
    phone: "+1-555-9012", 
    location: "Central District",
    requestedItems: [
      {
        id: "ri5",
        name: "Fresh Vegetables",
        quantity: 75,
        unit: "kg",
        description: "For daily meal preparation",
        urgency: "high",
        requestedAt: new Date("2024-01-24")
      },
      {
        id: "ri6",
        name: "Canned Food",
        quantity: 100,
        unit: "cans", 
        description: "Emergency food supplies",
        urgency: "medium",
        requestedAt: new Date("2024-01-25")
      }
    ]
  }
];

export const mockMatches: Match[] = [
  {
    id: "m1",
    donorId: "d1",
    receiverId: "r1", 
    donorName: "Green Valley Community Center",
    receiverName: "Hope Shelter",
    itemName: "Blankets",
    donatedQuantity: 50,
    requestedQuantity: 30,
    unit: "pieces",
    status: "pending",
    matchedAt: new Date("2024-01-26")
  },
  {
    id: "m2", 
    donorId: "d1",
    receiverId: "r1",
    donorName: "Green Valley Community Center", 
    receiverName: "Hope Shelter",
    itemName: "Canned Food",
    donatedQuantity: 200,
    requestedQuantity: 150,
    unit: "cans",
    status: "pending",
    matchedAt: new Date("2024-01-26")
  },
  {
    id: "m3",
    donorId: "d2",
    receiverId: "r2",
    donorName: "Tech Solutions Inc.",
    receiverName: "Bright Future School", 
    itemName: "Laptops",
    donatedQuantity: 15,
    requestedQuantity: 10,
    unit: "pieces",
    status: "pending",
    matchedAt: new Date("2024-01-27")
  },
  {
    id: "m4",
    donorId: "d2", 
    receiverId: "r2",
    donorName: "Tech Solutions Inc.",
    receiverName: "Bright Future School",
    itemName: "School Supplies",
    donatedQuantity: 300,
    requestedQuantity: 250,
    unit: "sets", 
    status: "pending",
    matchedAt: new Date("2024-01-27")
  },
  {
    id: "m5",
    donorId: "d3",
    receiverId: "r3",
    donorName: "Fresh Foods Market",
    receiverName: "Community Kitchen",
    itemName: "Fresh Vegetables",
    donatedQuantity: 100,
    requestedQuantity: 75, 
    unit: "kg",
    status: "pending",
    matchedAt: new Date("2024-01-28")
  }
];