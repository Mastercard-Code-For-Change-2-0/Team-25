export async function GET() {
  await dbConnect();
  const items = await ListedItem.find({});
  return NextResponse.json({ items });
}
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ListedItem from "../../../lib/schemas/listed_items.mongoose";
import { dbConnect } from "../../../lib/mongoose";

import { ListedRequest } from "../../../lib/schemas/listed_items.mongoose";
import {
  matchRequestToListings,
  approveTransaction,
} from "../../../../server/transaction.service";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const item = await ListedItem.create({
      ...body,
      submittedBy: new mongoose.Types.ObjectId(), // dummy user
    });
    // Try to match any pending requests after new item is created
    let transaction = null;
    const pendingRequests = await ListedRequest.find({
      category: item.category,
      status: "active",
      quantity: { $gt: 0 },
    }).sort({ createdAt: 1 });
    for (const req of pendingRequests) {
      try {
        transaction = await matchRequestToListings(req._id);
        // Auto-approve for now
        await approveTransaction(
          transaction._id,
          new mongoose.Types.ObjectId()
        );
        break;
      } catch (e) {
        // No match for this request, try next
      }
    }
    return NextResponse.json({ success: true, item, transaction });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
