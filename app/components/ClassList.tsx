"use client";

import { useEffect, useMemo, useState } from "react";
import type { Booking, ClassItem, MockUser } from "@/types";
import { fetchClasses } from "@/lib/api";
import { MOCK_USERS } from "@/lib/users";
import ClassCard from "./ClassCard";
import UserSwitcher from "./UserSwitcher";

type SortKey = "soonest" | "name" | "spots";

export default function ClassList() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentUser, setCurrentUser] = useState<MockUser>(MOCK_USERS[0]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("soonest");

  async function loadClasses() {
    const data = await fetchClasses();
    setClasses(data.classes);
    setBookings(data.bookings);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchClasses();
        if (cancelled) return;
        setClasses(data.classes);
        setBookings(data.bookings);
      } catch (err) {
        console.error("Failed to load classes", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await loadClasses();
    } catch (err) {
      console.error("Refresh failed", err);
    } finally {
      setRefreshing(false);
    }
  }

  function handleLocalUpdate(updated: ClassItem) {
    setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }

  const sortedClasses = useMemo(() => {
    const copy = [...classes];
    switch (sortBy) {
      case "soonest":
        return copy.sort(
          (a, b) =>
            new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
        );
      case "name":
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case "spots":
        return copy.sort(
          (a, b) =>
            b.capacity - b.bookedUsers - (a.capacity - a.bookedUsers)
        );
      default:
        return copy;
    }
  }, [classes, sortBy]);

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Arketa Booking
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Book your next class.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="rounded border border-zinc-300 bg-white px-3 py-1 text-sm font-medium text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          <UserSwitcher currentUser={currentUser} onChange={setCurrentUser} />
        </div>
      </header>

      <div className="flex items-center gap-2">
        <label
          htmlFor="sort-by"
          className="text-sm text-zinc-600 dark:text-zinc-400"
        >
          Sort by
        </label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option value="soonest">Soonest</option>
          <option value="name">Name</option>
          <option value="spots">Spots left</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading classes…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedClasses.map((c, index) => (
            <ClassCard
              key={index}
              classInfo={c}
              currentUser={currentUser}
              bookings={bookings}
              onLocalUpdate={handleLocalUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
