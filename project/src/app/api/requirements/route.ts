import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Requirement from "@/lib/models/Requirement";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

// GET - Fetch requirements (with filters)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const urgency = searchParams.get("urgency");
    const state = searchParams.get("state");
    const city = searchParams.get("city");
    const verified = searchParams.get("verified");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (urgency) filter.urgency = urgency;
    if (state) filter["location.state"] = state;
    if (city) filter["location.city"] = city;
    if (verified === "true") filter.adminVerified = true;

    // Only show active and public requirements by default
    if (!status) filter.status = { $in: ["active", "paused"] };
    filter.visibility = "public";

    const skip = (page - 1) * limit;

    const requirements = await Requirement.find(filter)
      .populate("requesterId", "email role receiverSubtype")
      .sort({ urgency: 1, createdAt: -1 }) // Critical first, then newest
      .skip(skip)
      .limit(limit);

    const total = await Requirement.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: requirements,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: requirements.length,
        totalItems: total,
      },
    });
  } catch (error: any) {
    console.error("Get requirements error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch requirements" },
      { status: 500 }
    );
  }
}

// POST - Create new requirement (for receivers/students)
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
    if (!payload || payload.role !== "student") {
      return NextResponse.json(
        { success: false, message: "Only students/receivers can create requirements" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      type,
      targetAmount,
      items,
      urgency = "medium",
      location,
      beneficiaryInfo,
      images,
      verificationDocuments,
      deadline,
      tags,
      visibility = "public",
    } = body;

    // Validate required fields
    if (!title || !description || !category || !type || !location || !beneficiaryInfo || !deadline) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate type-specific fields
    if ((type === "monetary" || type === "both") && !targetAmount) {
      return NextResponse.json(
        { success: false, message: "Target amount is required for monetary requirements" },
        { status: 400 }
      );
    }

    if ((type === "material" || type === "both") && (!items || items.length === 0)) {
      return NextResponse.json(
        { success: false, message: "Items are required for material requirements" },
        { status: 400 }
      );
    }

    // Validate deadline is in the future
    if (new Date(deadline) <= new Date()) {
      return NextResponse.json(
        { success: false, message: "Deadline must be in the future" },
        { status: 400 }
      );
    }

    const newRequirement = new Requirement({
      requesterId: payload.userId,
      title,
      description,
      category,
      type,
      targetAmount: (type === "monetary" || type === "both") ? targetAmount : undefined,
      items: (type === "material" || type === "both") ? items : undefined,
      urgency,
      location,
      beneficiaryInfo,
      images: images || [],
      verificationDocuments: verificationDocuments || [],
      deadline,
      tags: tags || [],
      visibility,
      adminVerified: false,
    });

    const savedRequirement = await newRequirement.save();
    
    // Populate the response with requester details
    const populatedRequirement = await Requirement.findById(savedRequirement._id)
      .populate("requesterId", "email role receiverSubtype");

    return NextResponse.json({
      success: true,
      message: "Requirement created successfully",
      data: populatedRequirement,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Create requirement error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create requirement" },
      { status: 500 }
    );
  }
}
