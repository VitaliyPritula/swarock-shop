import { createOrder } from "@/src/lib/shop.functions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createOrder(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ORDER_SUBMISSION_FAILED";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
