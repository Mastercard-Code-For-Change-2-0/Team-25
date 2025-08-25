export interface Donation {
  id: string
  title: string
  purpose: string
  quantity: number
  unit: string
  description: string
  location: string
  donorName: string
  datePosted: string
  category: string
  urgency: "low" | "medium" | "high"
}

export const sampleDonations: Donation[] = [
  {
    id: "1",
    title: "Food Supplies for Shelter",
    purpose: "Emergency food distribution for homeless shelter",
    quantity: 50,
    unit: "meals",
    description: "Fresh prepared meals ready for immediate distribution. Includes vegetarian options.",
    location: "Downtown Community Center",
    donorName: "City Food Bank",
    datePosted: "2024-01-15",
    category: "NGO",
    urgency: "high",
  },
  {
    id: "2",
    title: "Winter Clothing Drive",
    purpose: "Warm clothing for families in need",
    quantity: 25,
    unit: "sets",
    description: "Complete winter clothing sets including jackets, gloves, and warm socks for all ages.",
    location: "North Side Community",
    donorName: "Local Clothing Store",
    datePosted: "2024-01-14",
    category: "Community Orgs",
    urgency: "medium",
  },
  {
    id: "3",
    title: "School Supplies for Students",
    purpose: "Educational materials for underprivileged children",
    quantity: 100,
    unit: "kits",
    description: "Complete school supply kits with notebooks, pens, pencils, and basic stationery.",
    location: "East Elementary School",
    donorName: "Education Foundation",
    datePosted: "2024-01-13",
    category: "Schools",
    urgency: "low",
  },
  {
    id: "4",
    title: "Medical Equipment Donation",
    purpose: "Basic medical supplies for clinic",
    quantity: 15,
    unit: "boxes",
    description: "First aid supplies, bandages, antiseptics, and basic medical equipment.",
    location: "Community Health Clinic",
    donorName: "Medical Supply Co.",
    datePosted: "2024-01-12",
    category: "NGO",
    urgency: "high",
  },
  {
    id: "5",
    title: "Books for Library",
    purpose: "Educational books for community library",
    quantity: 200,
    unit: "books",
    description: "Mix of educational, fiction, and children's books to expand library collection.",
    location: "Central Library",
    donorName: "Book Publishers United",
    datePosted: "2024-01-11",
    category: "Schools",
    urgency: "low",
  },
  {
    id: "6",
    title: "Emergency Blankets",
    purpose: "Warmth for disaster relief",
    quantity: 75,
    unit: "blankets",
    description: "High-quality emergency blankets for disaster relief and homeless outreach.",
    location: "Emergency Response Center",
    donorName: "Relief Organization",
    datePosted: "2024-01-10",
    category: "Old Age Homes",
    urgency: "medium",
  },
  {
    id: "7",
    title: "Student Accommodation Supplies",
    purpose: "Bedding and furniture for student hostel",
    quantity: 30,
    unit: "sets",
    description: "Complete bedding sets and basic furniture for student accommodation.",
    location: "University Hostel",
    donorName: "Furniture Warehouse",
    datePosted: "2024-01-09",
    category: "Hostels",
    urgency: "medium",
  },
  {
    id: "8",
    title: "Elderly Care Supplies",
    purpose: "Medical and comfort items for elderly residents",
    quantity: 40,
    unit: "kits",
    description: "Personal care items, medications, and comfort supplies for elderly care facility.",
    location: "Sunset Senior Home",
    donorName: "Healthcare Foundation",
    datePosted: "2024-01-08",
    category: "Old Age Homes",
    urgency: "high",
  },
  {
    id: "9",
    title: "Community Garden Tools",
    purpose: "Gardening equipment for neighborhood project",
    quantity: 20,
    unit: "tool sets",
    description: "Complete gardening tool sets for community garden maintenance and development.",
    location: "Green Valley Community",
    donorName: "Garden Supply Store",
    datePosted: "2024-01-07",
    category: "Community Orgs",
    urgency: "low",
  },
  {
    id: "10",
    title: "Hostel Kitchen Equipment",
    purpose: "Cooking facilities upgrade for student hostel",
    quantity: 5,
    unit: "appliance sets",
    description: "Kitchen appliances including microwaves, refrigerators, and cooking equipment.",
    location: "Tech University Hostel",
    donorName: "Appliance Depot",
    datePosted: "2024-01-06",
    category: "Hostels",
    urgency: "medium",
  },
  {
    id: "11",
    title: "Art Supplies for School",
    purpose: "Creative materials for art education program",
    quantity: 60,
    unit: "art kits",
    description: "Complete art supply kits with paints, brushes, canvases, and drawing materials.",
    location: "Creative Arts Elementary",
    donorName: "Art Supply Company",
    datePosted: "2024-01-05",
    category: "Schools",
    urgency: "low",
  },
  {
    id: "12",
    title: "Miscellaneous Household Items",
    purpose: "Various household necessities for families",
    quantity: 35,
    unit: "boxes",
    description: "Mixed household items including cleaning supplies, small appliances, and daily necessities.",
    location: "Community Distribution Center",
    donorName: "Local Donors",
    datePosted: "2024-01-04",
    category: "Others",
    urgency: "medium",
  },
]

export interface DonationRequest {
  id: string
  title: string
  purpose: string
  quantityNeeded: number
  unit: string
  description: string
  urgency: "low" | "medium" | "high"
  status: "pending" | "approved" | "fulfilled" | "rejected"
  dateRequested: string
  category: string
}

export const sampleRequests: DonationRequest[] = [
  {
    id: "req-1",
    title: "Urgent Food Supplies",
    purpose: "Emergency food for flood victims",
    quantityNeeded: 100,
    unit: "meals",
    description: "Need immediate food supplies for families affected by recent flooding.",
    urgency: "high",
    status: "pending",
    dateRequested: "2024-01-16",
    category: "Food",
  },
  {
    id: "req-2",
    title: "Children's Toys",
    purpose: "Holiday gifts for orphanage",
    quantityNeeded: 30,
    unit: "toys",
    description: "Educational toys and games for children aged 5-12 at local orphanage.",
    urgency: "medium",
    status: "approved",
    dateRequested: "2024-01-10",
    category: "Children",
  },
  {
    id: "req-3",
    title: "Computer Equipment",
    purpose: "Digital literacy program",
    quantityNeeded: 10,
    unit: "laptops",
    description: "Refurbished laptops for adult education computer classes.",
    urgency: "low",
    status: "fulfilled",
    dateRequested: "2024-01-05",
    category: "Technology",
  },
]
