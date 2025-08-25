import mongoose, { Schema, Document, Types } from "mongoose";

export interface IListedItem extends Document {
  title: string;
  description: string;
  category: string;
  submittedBy: Types.ObjectId;
  approvedBy: Types.ObjectId;
  thumbnail: string;
  createdAt: Date;
  available: number;
  claimed: number;
  status: "active" | "completed";
  recieverId: Types.ObjectId[];
  distribution: string[]; // URLs or base64 images
  distributionDate: string;
  deliveryTime?: Date;
  transactions?: Types.ObjectId[];
}

const ListedItemsSchema: Schema = new Schema<IListedItem>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  approvedBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
  thumbnail: { type: String },
  createdAt: { type: Date, default: Date.now },
  available: { type: Number, required: true },
  claimed: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "completed"], default: "active" },
  recieverId: [{ type: Schema.Types.ObjectId, ref: "User" }],
  distribution: [{ type: String }], // URLs or base64 images
  distributionDate: { type: String },
  deliveryTime: { type: Date },
  transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
});

export default mongoose.models.ListedItem ||
  mongoose.model<IListedItem>("ListedItem", ListedItemsSchema);

export interface IListedRequest extends Document {
  title: string;
  description: string;
  purpose: string;
  category: string;
  quantity: number;
  submittedBy?: Types.ObjectId;
  createdAt?: Date;
  status?: "active" | "completed";
  transactions?: Types.ObjectId[];
}

const ListedRequestSchema: Schema = new Schema<IListedRequest>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  purpose: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "completed"], default: "active" },
  transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
});

export const ListedRequest =
  mongoose.models.ListedRequest ||
  mongoose.model<IListedRequest>("ListedRequest", ListedRequestSchema);
