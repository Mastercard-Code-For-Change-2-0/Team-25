export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  items: DonationItem[];
}

export interface Receiver {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  requestedItems: RequestItem[];
}

export interface DonationItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  description?: string;
  donatedAt: Date;
}

export interface RequestItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  description?: string;
  urgency: "low" | "medium" | "high";
  requestedAt: Date;
}

export interface Match {
  id: string;
  donorId: string;
  receiverId: string;
  donorName: string;
  receiverName: string;
  itemName: string;
  donatedQuantity: number;
  requestedQuantity: number;
  unit: string;
  status: "pending" | "approved" | "completed";
  matchedAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
}