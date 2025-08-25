import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITransaction extends Document {
  requestId: Types.ObjectId;
  listingIds: Types.ObjectId[];
  quantity: number;
  category: string;
  status: "pending" | "approved" | "declined";
  adminId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  completionTime?: Date;
}

const TransactionSchema: Schema = new Schema<ITransaction>({
  requestId: {
    type: Schema.Types.ObjectId,
    ref: "ListedRequest",
    required: true,
  },
  listingIds: [
    { type: Schema.Types.ObjectId, ref: "ListedItem", required: true },
  ],
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "declined"],
    default: "pending",
  },
  adminId: { type: Schema.Types.ObjectId, ref: "AdminUser" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completionTime: { type: Date },
});

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
