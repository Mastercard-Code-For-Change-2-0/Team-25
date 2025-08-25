import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Donation from "@/lib/models/Donation";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

// GET - Fetch donations (with filters)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const donorId = searchParams.get("donorId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (donorId) filter.donorId = donorId;

    const skip = (page - 1) * limit;

    const donations = await Donation.find(filter)
      .populate("donorId", "email role donorType")
      .populate("recipientId", "email role")
      .populate("approvedBy", "email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Donation.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: donations,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: donations.length,
        totalItems: total,
      },
    });
  } catch (error: any) {
    console.error("Get donations error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}

// POST - Create new donation
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      amount,
      items,
      type,
      urgency = "medium",
      location,
      images,
      deadline,
    } = body;

    // Validate required fields
    if (!title || !description || !category || !type || !location) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate type-specific fields
    if (type === "monetary" && !amount) {
      return NextResponse.json(
        { success: false, message: "Amount is required for monetary donations" },
        { status: 400 }
      );
    }

    if (type === "material" && (!items || items.length === 0)) {
      return NextResponse.json(
        { success: false, message: "Items are required for material donations" },
        { status: 400 }
      );
    }

    const newDonation = new Donation({
      donorId: payload.userId,
      title,
      description,
      category,
      amount: type === "monetary" ? amount : undefined,
      items: type === "material" ? items : undefined,
      type,
      urgency,
      location,
      images: images || [],
      deadline,
      status: "pending",
    });

    const savedDonation = await newDonation.save();
    
    // Populate the response with donor details
    const populatedDonation = await Donation.findById(savedDonation._id)
      .populate("donorId", "email role donorType");

    return NextResponse.json({
      success: true,
      message: "Donation created successfully",
      data: populatedDonation,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Create donation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create donation" },
      { status: 500 }
    );
  }
}
