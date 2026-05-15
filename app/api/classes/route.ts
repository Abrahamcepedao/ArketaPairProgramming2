import { NextResponse } from "next/server";
import { getBookings, getClasses } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ classes: getClasses(), bookings: getBookings() });
}
