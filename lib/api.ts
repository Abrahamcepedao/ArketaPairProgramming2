import type { Booking, ClassItem } from "../types";

export async function fetchClasses(): Promise<{
  classes: ClassItem[];
  bookings: Booking[];
}> {
  const res = await fetch("/api/classes", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch classes");
  const data = await res.json();
  return { classes: data.classes, bookings: data.bookings ?? [] };
}

export async function bookClass(
  classId: string,
  userId: string
): Promise<ClassItem> {
  const res = await fetch("/api/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ classId, userId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? "Booking failed");
  }
  return data.class as ClassItem;
}

export async function cancelBooking(
  classId: string,
  userId: string
): Promise<ClassItem> {
  const res = await fetch("/api/cancel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ classId, userId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? "Cancel failed");
  }
  return data.class as ClassItem;
}
