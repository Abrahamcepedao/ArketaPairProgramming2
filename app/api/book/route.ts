import { NextResponse } from "next/server";
import { bookClass, getBookings, getClasses } from "@/lib/store";
import {
  hasUserBooked,
  isClassFull,
  isClassInPast,
} from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json();
  const { classId, userId } = body ?? {};

  if (!classId || !userId) {
    return NextResponse.json(
      { error: "Missing classId or userId" },
      { status: 400 }
    );
  }

  const cls = getClasses().find((c) => c.id === classId);
  if (!cls) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  if (isClassInPast(cls)) {
    return NextResponse.json(
      { error: "This class has already happened" },
      { status: 400 }
    );
  }

  if (hasUserBooked(getBookings(), userId, classId)) {
    return NextResponse.json(
      { error: "You're already booked for this class" },
      { status: 409 }
    );
  }

  if (isClassFull(cls)) {
    return NextResponse.json({ error: "Class is full" }, { status: 400 });
  }

  const updated = await bookClass(classId, userId);
  return NextResponse.json({ class: updated });
}
