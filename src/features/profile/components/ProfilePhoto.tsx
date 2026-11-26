"use client";

import { useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { removeProfilePhoto, setProfilePhoto } from "@/app/actions/profile";
import { Button } from "@/components/ui/Button";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
import { useToast } from "@/components/ui/Toaster";
import type { MyAccount } from "@/types/member";
import { PHOTO_MAX_BYTES, PHOTO_TYPES } from "../schemas";

/**
 * The member's own portrait: their photograph, or their initials, with a
 * way to change it and a way to take it down.
 *
 * The file is checked here for type and size before it is sent, so a
 * twenty-megabyte phone photo is refused at once rather than after the
 * upload. The backend checks the content itself; this is only a courtesy.
 */
export function ProfilePhoto({
  name,
  photo,
  onChanged,
}: {
  name: string;
  photo: string;
  onChanged: (account: MyAccount | null) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"upload" | "remove" | null>(null);
  const toast = useToast();

  const upload = async (file: File) => {
    if (!PHOTO_TYPES.includes(file.type)) {
      toast({ message: "Use a JPEG, PNG, WebP or HEIC photograph." });
      return;
    }
    if (file.size > PHOTO_MAX_BYTES) {
      toast({ message: "That photograph is over 5 MB. Choose a smaller one." });
      return;
    }

    const form = new FormData();
    form.append("photo", file);
    setBusy("upload");
    const outcome = await setProfilePhoto(form);
    setBusy(null);
    toast({ message: outcome.message });
    if (outcome.ok) onChanged(outcome.account);
  };

  const remove = async () => {
    setBusy("remove");
    const outcome = await removeProfilePhoto();
    setBusy(null);
    toast({ message: outcome.message });
    if (outcome.ok) onChanged(outcome.account);
  };

  return (
    <div className="flex shrink-0 flex-col items-center gap-3">
      <PersonAvatar
        name={name}
        photo={photo}
        sizes="12rem"
        className="ring-member-tint text-h1 size-40 ring-4 sm:size-48"
      />

      <input
        ref={input}
        type="file"
        accept={PHOTO_TYPES.join(",")}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          /* Cleared, so choosing the same file again still counts. */
          event.target.value = "";
          if (file) void upload(file);
        }}
      />

      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={busy !== null}
          onClick={() => input.current?.click()}
        >
          <Camera aria-hidden className="size-4" />
          {busy === "upload"
            ? "Uploading…"
            : photo
              ? "Change photo"
              : "Add a photo"}
        </Button>
        {photo ? (
          <Button
            variant="ghost"
            size="sm"
            disabled={busy !== null}
            onClick={() => void remove()}
            aria-label="Remove your photo"
          >
            <Trash2 aria-hidden className="size-4" />
            {busy === "remove" ? "Removing…" : null}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
