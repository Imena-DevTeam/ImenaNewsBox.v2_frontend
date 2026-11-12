"use client";

import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";

/**
 * Puts the query client in reach of every client component.
 *
 * It sits in the root layout, which is a server component, so this is the
 * boundary between the two. `getQueryClient` is what keeps one cache per
 * browser and a fresh one per server render — see the note there, because
 * getting it the wrong way round hands one visitor's data to the next.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}
