import type { Booking, ClassItem, ClassStatus } from "../types";

export function isClassInPast(cls: ClassItem, now: Date = new Date()): boolean {
  return new Date(cls.datetime).getTime() < now.getTime();
}

export function isClassFull(cls: ClassItem): boolean {
  return cls.bookedUsers >= cls.capacity;
}

export function hasUserBooked(
  bookings: Booking[],
  userId: string,
  classId: string
): boolean {
  return bookings.some((b) => b.userId === userId && b.classId === classId);
}

export function getStatus(
  cls: ClassItem,
  bookings: Booking[],
  userId: string,
  now: Date = new Date()
): ClassStatus {
  if (isClassInPast(cls, now)) return "past";
  if (hasUserBooked(bookings, userId, cls.id)) return "booked";
  if (isClassFull(cls)) return "full";
  return "available";
}
