import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  contact: string;
  address: string;
  govtId: string; // base64 string
  approved: 0 | 1;
  approvedBy?: Types.ObjectId; // references AdminUser _id
}

const UserSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  govtId: { type: String, required: true },
  approved: { type: Number, enum: [0, 1], default: 0 },
  approvedBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
