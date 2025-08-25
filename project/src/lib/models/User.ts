import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "admin" | "donor" | "student";
  donorType?: "individual" | "corporate" | "institution";
  receiverSubtype?:
    | "NGO"
    | "Schools"
    | "Hostels"
    | "Old age homes"
    | "Community organization";
  aadhaar: string;
  state: string;
  city: string;
  zipcode: string;
  address: string;
  mobile: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "donor", "student"],
    },
    donorType: {
      type: String,
      enum: ["individual", "corporate", "institution"],
      required: function (this: IUser) {
        return this.role === "donor";
      },
    },
    receiverSubtype: {
      type: String,
      enum: [
        "NGO",
        "Schools",
        "Hostels",
        "Old age homes",
        "Community organization",
      ],
      required: function (this: IUser) {
        return this.role === "student";
      },
    },
    aadhaar: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          return /^\d{12}$/.test(v);
        },
        message: "Aadhaar number must be 12 digits",
      },
    },
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
    zipcode: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^\d{5,6}$/.test(v);
        },
        message: "Zipcode must be 5-6 digits",
      },
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^\d{10}$/.test(v);
        },
        message: "Mobile number must be 10 digits",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
// Note: email index is automatically created by unique: true
UserSchema.index({ role: 1 });

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
