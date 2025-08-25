import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  donationId: mongoose.Types.ObjectId;
  requirementId?: mongoose.Types.ObjectId;
  donorId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  type: "monetary" | "material";
  amount?: number;
  items?: {
    name: string;
    quantity: number;
    estimatedValue?: number;
  }[];
  status: "initiated" | "processing" | "completed" | "failed" | "cancelled" | "disputed";
  paymentMethod?: "upi" | "bank_transfer" | "card" | "wallet" | "cash" | "direct";
  transactionId?: string;
  gatewayResponse?: any;
  deliveryInfo?: {
    method: "pickup" | "courier" | "direct" | "self_delivery";
    address?: string;
    trackingId?: string;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
    deliveryNotes?: string;
  };
  verificationDetails: {
    donorVerified: boolean;
    recipientVerified: boolean;
    adminVerified: boolean;
    verificationNotes?: string;
  };
  feedback?: {
    donorRating?: number;
    recipientRating?: number;
    donorComment?: string;
    recipientComment?: string;
  };
  tax?: {
    applicable: boolean;
    amount?: number;
    receiptGenerated?: boolean;
    receiptNumber?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    donationId: {
      type: Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
    },
    requirementId: {
      type: Schema.Types.ObjectId,
      ref: "Requirement",
    },
    donorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["monetary", "material"],
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
      estimatedValue: {
        type: Number,
        min: 0,
      },
    }],
    status: {
      type: String,
      required: true,
      enum: ["initiated", "processing", "completed", "failed", "cancelled", "disputed"],
      default: "initiated",
    },
    paymentMethod: {
      type: String,
      enum: ["upi", "bank_transfer", "card", "wallet", "cash", "direct"],
    },
    transactionId: {
      type: String,
      trim: true,
    },
    gatewayResponse: {
      type: Schema.Types.Mixed,
    },
    deliveryInfo: {
      method: {
        type: String,
        enum: ["pickup", "courier", "direct", "self_delivery"],
      },
      address: {
        type: String,
        trim: true,
      },
      trackingId: {
        type: String,
        trim: true,
      },
      estimatedDelivery: {
        type: Date,
      },
      actualDelivery: {
        type: Date,
      },
      deliveryNotes: {
        type: String,
        trim: true,
      },
    },
    verificationDetails: {
      donorVerified: {
        type: Boolean,
        default: false,
      },
      recipientVerified: {
        type: Boolean,
        default: false,
      },
      adminVerified: {
        type: Boolean,
        default: false,
      },
      verificationNotes: {
        type: String,
        trim: true,
      },
    },
    feedback: {
      donorRating: {
        type: Number,
        min: 1,
        max: 5,
      },
      recipientRating: {
        type: Number,
        min: 1,
        max: 5,
      },
      donorComment: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
      recipientComment: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
    },
    tax: {
      applicable: {
        type: Boolean,
        default: false,
      },
      amount: {
        type: Number,
        min: 0,
      },
      receiptGenerated: {
        type: Boolean,
        default: false,
      },
      receiptNumber: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
TransactionSchema.index({ donationId: 1 });
TransactionSchema.index({ requirementId: 1 });
TransactionSchema.index({ donorId: 1 });
TransactionSchema.index({ recipientId: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ createdAt: -1 });
TransactionSchema.index({ transactionId: 1 });

export default mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
