import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/mongoose";
import mongoose from "mongoose";
import { declineTransaction } from "../../../../../server/transaction.service";

export async function POST(req: Request) {
  await dbConnect();
  const { transactionId } = await req.json();
  if (!transactionId)
    return NextResponse.json(
      { success: false, error: "Missing transactionId" },
      { status: 400 }
    );
  const tx = await declineTransaction(
    new mongoose.Types.ObjectId(transactionId),
    new mongoose.Types.ObjectId()
  );
  return NextResponse.json({ success: true, transaction: tx });
}
