export async function GET() {
  await dbConnect();
  const requests = await ListedRequest.find({});
  return NextResponse.json({ requests });
}
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ListedRequest } from "../../../lib/schemas/listed_items.mongoose";
import { dbConnect } from "../../../lib/mongoose";

import {
  matchRequestToListings,
  approveTransaction,
} from "../../../../server/transaction.service";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const request = await ListedRequest.create({
      ...body,
      submittedBy: new mongoose.Types.ObjectId(),
    });
    let transaction = null;
    try {
      transaction = await matchRequestToListings(request._id);

      await approveTransaction(transaction._id, new mongoose.Types.ObjectId());
    } catch (e) {}
    return NextResponse.json({ success: true, request, transaction });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
