# Arketa Booking — Support Engineering Exercise

You're stepping into a simplified class-booking app that's been limping along. Support has been collecting complaints, product has a couple of asks, and the team wants you to steady the ship.

## Objective

1. Investigate what's going wrong.
2. Fix it end-to-end.
3. Ship a small feature improvement.

You're welcome to use AI tools. We care most about how you reason, debug, and communicate trade-offs.

## Run it

```bash
yarn install
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Reported support tickets

These came in from customers and the support team over the last couple of weeks. They're written the way tickets actually arrive — vague, symptom-first, sometimes with the user's own theory baked in. Some may share a root cause; some may be describing something other than what they think. **Treat them as symptoms, not specs.**

---

**#5102 — from CX lead**

> Customer says they clicked Cancel on Pilates and it cancelled their HIIT instead. They were sorting the list when it happened. We thought it was user error at first but a second customer just reported the same thing on a different class. Both said they had re-sorted right before clicking.

---

**#5118 — from customer (forwarded by CX)**

> i booked the morning yoga and the card never updated to say i was booked — it still said available. i thought maybe the click didn't go through so i clicked book again. then i got an error. did it book me or not? feels broken

---

**#5124 — from internal QA**

> Found a class on the dashboard that says "-1 of 8 booked". Studio manager has a screenshot. Not sure how to reproduce it cleanly yet — was poking around as Sam (who hadn't booked anything) and clicking Cancel on stuff to see what would happen. Probably user error but the negative count shouldn't be possible regardless.

---

**#5131 — from the HIIT studio manager**

> HIIT Express was oversold again last night — 9 on the roster, room fits 8. Two of the front-desk laptops were both checking people in around 5:58 and the last seat seems to have gone to both. Has happened twice this month. Capacity isn't optional, the fire marshal cares.

---

## Feature request — ship it

- **Waitlist** — when a class is full, let users join a waitlist. Show waitlist count on the card. Bonus: when someone cancels, the waitlist decreases. (Status labels are already shipped on each card — Booked / Available / Full / Past — so you have a place to surface waitlist state too.)

## Tips

- Some issues may require repeated or rapid interactions to reproduce.
- The dev-server terminal logs a line on every booking action — worth keeping an eye on.
- Support tickets describe symptoms. **Reproduce before you decide what the root cause is**, and don't trust the user's theory.
- A well-placed fix may require the UI to start surfacing states (errors, "already booked") that it doesn't today — don't stop at "the API now rejects correctly."
- Module-level state in `lib/store.ts` resets on hot-reload; that's fine for the interview.

## What we care about

- **Reproduce first, fix second.** Show us how you confirm a bug before you change code.
- **End-to-end reasoning.** Improve the reliability of the booking system so invalid actions cannot occur — wherever they originate.
- **Trade-offs, out loud.** Talk through the decisions you're making and what you'd do differently with more time.

## Bonus take-home (optional, after the live session)

If you'd like to keep going, fork the repo, push your work to your fork, and send us back:

1. a link to your fork, and
2. a short Loom (≤ 8 min) walking us through what you built and why.

**Pick ONE of these tracks:**

- **Track A — "My Bookings" + persistence.** Per-user bookings already exist in the in-memory store. Add a lightweight "My Bookings" view (a new page or panel) showing the current user's classes with a cancel action scoped to their own booking, and persist per-user state somewhere durable (localStorage, file, or sqlite — your call). Include 3–5 tests covering the per-user edge cases you think matter most.

- **Track B — Harden your concurrency fix.** Take the concurrency fix you shipped in the live session and deepen it: (a) write a test that reliably fails against the unfixed code and passes against yours — show us how you make the race deterministic in a test, (b) compare your approach to at least one alternative (mutex, queue, optimistic concurrency, DB-level constraint) and call out where each one falls down at higher scale or under a different storage backend.

- **Track C — Waitlist with auto-promote.** Build on the live waitlist feature: when someone cancels a full class, automatically promote the first person off the waitlist into the booking. Include an in-app notification or log entry so the promoted user knows. Include 3–5 tests covering ordering, edge cases (promoted user is already booked elsewhere, last person leaves, etc.).

**In your Loom, cover:** what you built, one thing you chose not to do and why, what you'd want to do next with another day.

## Project layout

```
/app
  page.tsx
  layout.tsx
  /components        ClassList, ClassCard, UserSwitcher
  /api
    /classes         GET list
    /book            POST { classId, userId }
    /cancel          POST { classId, userId }
/lib
  api.ts             client fetch helpers
  store.ts           in-memory store
  users.ts           mock users
  validation.ts      class status + invariant helpers
/types.ts
/data.ts             seed data
```
