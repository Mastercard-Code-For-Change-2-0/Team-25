import mongoose, { Schema, Document } from "mongoose";

export interface IRequirement extends Document {
  requesterId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: "Education" | "Healthcare" | "Food" | "Clothing" | "Technology" | "Furniture" | "Other";
  type: "monetary" | "material" | "both";
  targetAmount?: number;
  currentAmount?: number;
  items?: {
    name: string;
    quantity: number;
    description?: string;
    received?: number;
  }[];
  urgency: "low" | "medium" | "high" | "critical";
  status: "active" | "paused" | "completed" | "expired" | "cancelled";
  location: {
    state: string;
    city: string;
    address?: string;
    pincode: string;
  };
  beneficiaryInfo: {
    count: number;
    ageGroup?: string;
    description: string;
  };
  images?: string[];
  verificationDocuments?: string[];
  deadline: Date;
  tags?: string[];
  donorsCount?: number;
  visibility: "public" | "verified_only";
  adminVerified: boolean;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RequirementSchema = new Schema<IRequirement>(
  {
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      maxlength: 3000,
    },
    category: {
      type: String,
      required: true,
      enum: ["Education", "Healthcare", "Food", "Clothing", "Technology", "Furniture", "Other"],
    },
    type: {
      type: String,
      required: true,
      enum: ["monetary", "material", "both"],
    },
    targetAmount: {
      type: Number,
      min: 0,
    },
    currentAmount: {
      type: Number,
      min: 0,
      default: 0,
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
      received: {
        type: Number,
        min: 0,
        default: 0,
      },
    }],
    urgency: {
      type: String,
      required: true,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "paused", "completed", "expired", "cancelled"],
      default: "active",
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
    beneficiaryInfo: {
      count: {
        type: Number,
        required: true,
        min: 1,
      },
      ageGroup: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
      },
    },
    images: [{
      type: String,
      trim: true,
    }],
    verificationDocuments: [{
      type: String,
      trim: true,
    }],
    deadline: {
      type: Date,
      required: true,
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    donorsCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    visibility: {
      type: String,
      required: true,
      enum: ["public", "verified_only"],
      default: "public",
    },
    adminVerified: {
      type: Boolean,
      default: false,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
RequirementSchema.index({ requesterId: 1 });
RequirementSchema.index({ status: 1 });
RequirementSchema.index({ category: 1 });
RequirementSchema.index({ urgency: 1 });
RequirementSchema.index({ "location.state": 1, "location.city": 1 });
RequirementSchema.index({ deadline: 1 });
RequirementSchema.index({ adminVerified: 1 });
RequirementSchema.index({ visibility: 1 });
RequirementSchema.index({ createdAt: -1 });
RequirementSchema.index({ tags: 1 });

export default mongoose.models.Requirement || mongoose.model<IRequirement>("Requirement", RequirementSchema);
