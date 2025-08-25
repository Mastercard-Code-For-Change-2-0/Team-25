import mongoose, { Schema, Document, Types } from "mongoose";

export interface IListedItem extends Document {
  title: string;
  description: string;
  submittedBy: Types.ObjectId;
  approvedBy: Types.ObjectId;
  thumbnail: string;
  createdAt: Date;
  available: number;
  claimed: number;
  status: boolean;
  recieverId: Types.ObjectId[];
  distribution: string[];
  distributionDate: string;
}

const ListedItemsSchema: Schema = new Schema<IListedItem>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  approvedBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
  thumbnail: { type: String },
  createdAt: { type: Date, default: Date.now },
  available: { type: Number, required: true },
  claimed: { type: Number, default: 0 },
  status: { type: Boolean, default: true },
  recieverId: [{ type: Schema.Types.ObjectId, ref: "User" }],
  distribution: [{ type: String }],
  distributionDate: { type: String },
});

export default mongoose.models.ListedItem ||
  mongoose.model<IListedItem>("ListedItem", ListedItemsSchema);

export interface IListedRequest extends Document {
  title: string;
  description: string;
  purpose: string;
  submittedBy?: Types.ObjectId;
  createdAt?: Date;
}

const ListedRequestSchema: Schema = new Schema<IListedRequest>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  purpose: { type: String, required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export const ListedRequest =
  mongoose.models.ListedRequest ||
  mongoose.model<IListedRequest>("ListedRequest", ListedRequestSchema);
