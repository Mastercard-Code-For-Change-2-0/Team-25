import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { createAuthResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      email,
      password,
      role,
      donorType,
      receiverSubtype,
      aadhaar,
      state,
      city,
      zipcode,
      address,
      mobile,
    } = body;

    // Validate required fields
    if (
      !email ||
      !password ||
      !role ||
      !aadhaar ||
      !state ||
      !city ||
      !zipcode ||
      !address ||
      !mobile
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate role-specific fields
    if (role === "donor" && !donorType) {
      return NextResponse.json(
        { success: false, message: "Donor type is required for donor role" },
        { status: 400 }
      );
    }

    if (role === "student" && !receiverSubtype) {
      return NextResponse.json(
        {
          success: false,
          message: "Receiver subtype is required for student role",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { aadhaar }],
    });

    if (existingUser) {
      const field =
        existingUser.email === email.toLowerCase() ? "email" : "aadhaar";
      return NextResponse.json(
        { success: false, message: `User with this ${field} already exists` },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const userData: any = {
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role === "receiver" ? "student" : role, // Map receiver to student
      aadhaar,
      state,
      city,
      zipcode,
      address,
      mobile,
    };

    if (role === "donor") {
      userData.donorType = donorType;
    } else if (role === "receiver" || role === "student") {
      userData.receiverSubtype = receiverSubtype;
    }

    const user = new User(userData);
    await user.save();

    // Create response with token
    const authResponse = createAuthResponse(
      user,
      "User registered successfully"
    );

    // Create response with Set-Cookie header
    const response = NextResponse.json(authResponse, { status: 201 });

    // Set HTTP-only cookie
    response.cookies.set("auth-token", authResponse.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json(
        { success: false, message: `User with this ${field} already exists` },
        { status: 400 }
      );
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
