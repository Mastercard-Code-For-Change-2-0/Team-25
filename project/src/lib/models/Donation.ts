import mongoose, { Schema, Document } from "mongoose";

export interface IDonation extends Document {
  donorId: mongoose.Types.ObjectId;
  recipientId?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: "Education" | "Healthcare" | "Food" | "Clothing" | "Technology" | "Furniture" | "Other";
  amount?: number;
  items?: {
    name: string;
    quantity: number;
    description?: string;
  }[];
  type: "monetary" | "material";
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  urgency: "low" | "medium" | "high" | "critical";
  location: {
    state: string;
    city: string;
    address?: string;
    pincode: string;
  };
  images?: string[];
  deadline?: Date;
  verificationDocuments?: string[];
  adminNotes?: string;
  approvedBy?: mongoose.Types.ObjectId;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema = new Schema<IDonation>(
  {
    donorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
      enum: ["Education", "Healthcare", "Food", "Clothing", "Technology", "Furniture", "Other"],
    },
    amount: {
      type: Number,
      min: 0,
    },
    items: [{
      name: {
        type: String,
        required: true,
        trim: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      description: {
        type: String,
        trim: true,
      },
    }],
    type: {
      type: String,
      required: true,
      enum: ["monetary", "material"],
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    urgency: {
      type: String,
      required: true,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    location: {
      state: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        required: true,
        match: /^\d{6}$/,
      },
    },
    images: [{
      type: String,
      trim: true,
    }],
    deadline: {
      type: Date,
    },
    verificationDocuments: [{
      type: String,
      trim: true,
    }],
    adminNotes: {
      type: String,
      trim: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
DonationSchema.index({ donorId: 1 });
DonationSchema.index({ recipientId: 1 });
DonationSchema.index({ status: 1 });
DonationSchema.index({ category: 1 });
DonationSchema.index({ "location.state": 1, "location.city": 1 });
DonationSchema.index({ createdAt: -1 });

export default mongoose.models.Donation || mongoose.model<IDonation>("Donation", DonationSchema);
