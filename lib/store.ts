import type { Booking, ClassItem } from "../types";
import { seedClasses } from "../data";

type Store = {
  classes: ClassItem[];
  bookings: Booking[];
};

const globalForStore = globalThis as unknown as { __bookingStore?: Store };

function getStore(): Store {
  if (!globalForStore.__bookingStore) {
    globalForStore.__bookingStore = {
      classes: seedClasses(),
      bookings: [],
    };
  }
  return globalForStore.__bookingStore;
}

export function getClasses(): ClassItem[] {
  return getStore().classes;
}

export function getBookings(): Booking[] {
  return getStore().bookings;
}

export function getUserBookings(userId: string): Booking[] {
  return getStore().bookings.filter((b) => b.userId === userId);
}

export async function bookClass(
  classId: string,
  userId: string
): Promise<ClassItem | null> {
  const store = getStore();
  const cls = store.classes.find((c) => c.id === classId);
  if (!cls) return null;

  await new Promise((r) => setTimeout(r, 50));

  store.bookings.push({ userId, classId });
  cls.bookedUsers += 1;
  console.log(
    "[book]",
    classId,
    "user=" + userId,
    "→",
    cls.bookedUsers,
    "of",
    cls.capacity
  );
  return cls;
}

export function cancelBooking(
  classId: string,
  userId: string
): ClassItem | null {
  const store = getStore();
  const cls = store.classes.find((c) => c.id === classId);
  if (!cls) return null;

  const idx = store.bookings.findIndex((b) => b.classId === classId);
  if (idx >= 0) store.bookings.splice(idx, 1);

  cls.bookedUsers -= 1;
  console.log(
    "[cancel]",
    classId,
    "user=" + userId,
    "→",
    cls.bookedUsers,
    "of",
    cls.capacity
  );
  return cls;
}
