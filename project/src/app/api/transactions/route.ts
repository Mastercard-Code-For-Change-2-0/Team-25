import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/mongoose";
import Transaction from "../../../lib/schemas/transaction.mongoose";

export async function GET() {
  await dbConnect();
  const transactions = await Transaction.find({});
  return NextResponse.json({ transactions });
}
