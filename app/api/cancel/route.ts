import { NextResponse } from "next/server";
import { cancelBooking } from "@/lib/store";

export async function POST(req: Request) {
  const body = await req.json();
  const { classId, userId } = body ?? {};

  if (!classId || !userId) {
    return NextResponse.json(
      { error: "Missing classId or userId" },
      { status: 400 }
    );
  }

  const updated = cancelBooking(classId, userId);
  if (!updated) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }
  return NextResponse.json({ class: updated });
}
