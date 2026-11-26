"use client";

import { useState } from "react";
import { MonitorSmartphone } from "lucide-react";
import { signOutDevice } from "@/app/actions/profile";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toaster";
import { timeAgo } from "@/lib/notifications";
import type { Device } from "@/types/member";

function readDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Where this account is signed in, most recently used first, and a way to
 * sign any other device out: a phone left at a relative's, a shared
 * computer. This device is marked, and signs out with the button at the top
 * of the page, which also clears its cookies.
 */
export function DeviceList({
  devices,
  now,
}: {
  /** null when the backend could not be asked. */
  devices: Device[] | null;
  /** Fixed on the server, so both sides agree what "an hour ago" means. */
  now: string;
}) {
  const [list, setList] = useState(devices ?? []);
  const [busy, setBusy] = useState<string | null>(null);
  const toast = useToast();
  const at = Date.parse(now);

  const signOut = async (device: Device) => {
    setBusy(device.id);
    const outcome = await signOutDevice(device.id);
    setBusy(null);
    toast({
      message: outcome.ok ? `${device.label} was signed out.` : outcome.message,
    });
    if (outcome.ok) setList((was) => was.filter((one) => one.id !== device.id));
  };

  return (
    <section aria-labelledby="devices" className="flex flex-col gap-4">
      <h2 id="devices" className="text-h4-m text-member-ink">
        Signed-in devices
      </h2>

      {devices === null ? (
        <p role="alert" className="text-body-sm text-muted">
          The list of devices could not be loaded. Reload the page in a moment.
        </p>
      ) : (
        <ul className="border-member-border divide-member-border bg-surface divide-y rounded-md border">
          {list.map((device) => (
            <li
              key={device.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4 sm:px-5"
            >
              <span className="bg-member-tint text-brand grid size-10 shrink-0 place-items-center rounded-md">
                <MonitorSmartphone aria-hidden className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-body-sm text-member-ink font-semibold">
                  {device.label}
                </p>
                <p className="text-caption text-muted">
                  {device.current
                    ? "This device"
                    : `Last used ${timeAgo(device.lastUsedAt, at)}`}
                  {` · signed in ${readDate(device.signedInAt)}`}
                </p>
              </div>
              {device.current ? null : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busy === device.id}
                  onClick={() => void signOut(device)}
                  aria-label={`Sign out ${device.label}`}
                >
                  Sign out
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
