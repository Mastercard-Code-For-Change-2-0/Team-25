import { NextResponse } from "next/server";
import {
  fetchAllListedItems,
  addListedRequest,
} from "../../../../server/reciever.action";

// GET /api/reciever: fetch all listed items
export async function GET() {
  try {
    const items = await fetchAllListedItems();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST /api/reciever: add a listed request
export async function POST(request: Request) {
  try {
    const { title, description, purpose } = await request.json();
    if (!title || !description || !purpose) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }
    const insertedId = await addListedRequest({ title, description, purpose });
    return NextResponse.json({ success: true, insertedId });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
