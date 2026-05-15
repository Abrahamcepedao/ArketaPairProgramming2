"use client";

import { useCallback, useState } from "react";
import type { Booking, ClassItem, ClassStatus, MockUser } from "@/types";
import { bookClass, cancelBooking } from "@/lib/api";
import { getStatus } from "@/lib/validation";

type Props = {
  classInfo: ClassItem;
  currentUser: MockUser;
  bookings: Booking[];
  onLocalUpdate: (updated: ClassItem) => void;
};

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const STATUS_STYLES: Record<ClassStatus, string> = {
  past: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  booked:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  full: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  available:
    "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
};

const STATUS_LABEL: Record<ClassStatus, string> = {
  past: "Past",
  booked: "Booked",
  full: "Full",
  available: "Available",
};

export default function ClassCard({
  classInfo,
  currentUser,
  bookings,
  onLocalUpdate,
}: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const spotsLeft = classInfo.capacity - classInfo.bookedUsers;
  const status = getStatus(classInfo, bookings, currentUser.id);

  async function handleBook() {
    setPending(true);
    setError(null);
    try {
      const updated = await bookClass(classInfo.id, currentUser.id);
      onLocalUpdate(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setPending(false);
    }
  }

  const handleCancel = useCallback(async () => {
    setPending(true);
    setError(null);
    try {
      const updated = await cancelBooking(classInfo.id, currentUser.id);
      onLocalUpdate(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cancel failed");
    } finally {
      setPending(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bookDisabled =
    pending ||
    status === "past" ||
    status === "full" ||
    status === "booked";

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {classInfo.name}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            with {classInfo.instructor}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>

      <div className="text-sm text-zinc-700 dark:text-zinc-300">
        <div>{formatWhen(classInfo.datetime)}</div>
        <div>
          {classInfo.bookedUsers} of {classInfo.capacity} booked
          {spotsLeft > 0 ? ` · ${spotsLeft} spots left` : ""}
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}

      <div className="mt-1 flex gap-2">
        <button
          onClick={handleBook}
          disabled={bookDisabled}
          aria-label={`Book ${classInfo.name} as ${currentUser.name}`}
          className="rounded bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Book
        </button>
        <button
          onClick={handleCancel}
          disabled={pending}
          aria-label={`Cancel ${classInfo.name} as ${currentUser.name}`}
          className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
