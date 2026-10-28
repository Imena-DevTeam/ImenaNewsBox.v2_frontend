import { ROUTES } from "@/constants/routes";

export type NotificationKind = "photos" | "birthday" | "handover";

export interface FamilyNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  detail: string;
  /** ISO date-time; shown as "2 hours ago". */
  at: string;
  href: string;
}

/* TODO: the family service's update feed. Until it exists these are sample
   updates, said so in the drawer, pointing at pages that really exist. */
export const NOTIFICATIONS: FamilyNotification[] = [
  {
    id: "n1",
    kind: "photos",
    title: "New photographs in Fete memories",
    detail: "Five pictures from the celebration were added to the album.",
    at: "2026-10-27T08:10:00+02:00",
    href: `${ROUTES.GALLERY}/fete-memories`,
  },
  {
    id: "n2",
    kind: "birthday",
    title: "Bigwi's birthday is coming up",
    detail: "Light family · 29 March. Send a wish from the dashboard.",
    at: "2026-10-26T18:00:00+02:00",
    href: ROUTES.DASHBOARD,
  },
  {
    id: "n3",
    kind: "handover",
    title: "Handover notice",
    detail: "The evening the elders passed the torch is now in the archive.",
    at: "2026-10-24T12:30:00+02:00",
    href: `${ROUTES.BLOGS}/the-handover-when-the-elders-passed-the-torch`,
  },
];

/** Where which updates have been opened is kept on this device. */
export const NOTIFICATIONS_READ_KEY = "imena:notifications-read";

/** The ids stored under NOTIFICATIONS_READ_KEY; anything unreadable is none. */
export function parseRead(raw: string): Set<string> {
  try {
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

/** "just now", "3 hours ago", "2 days ago" — relative to `now`. */
export function timeAgo(iso: string, now: number = Date.now()): string {
  const minutes = Math.max(0, Math.round((now - Date.parse(iso)) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
