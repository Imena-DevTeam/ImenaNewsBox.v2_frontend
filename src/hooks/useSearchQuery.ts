import { useCallback, useSyncExternalStore } from "react";

const QUERY_PARAM = "q";

interface SearchQuery {
  query: string;
  onQuery: (value: string) => void;
}

/**
 * The dashboard's search state, in one place: the pill above the carousel
 * and the article list it filters both need it, so only these two components
 * know about it.
 *
 * The value lives outside React — in the URL as `?q=`, mirrored in memory —
 * and `useSyncExternalStore` is what lets the two components read it without
 * a wrapper re-rendering the rest of the page. That keeps the header, the
 * carousel, the birthday column, the subfamily cards and the tagline on the
 * server: the rest of the dashboard ships without this module.
 *
 * Keeping it in the URL means a filtered view survives a reload and can be
 * pasted to somebody else. It is written with `history.replaceState` rather
 * than read through `useSearchParams`: the pill filters a page the member has
 * already opened, and reading a search parameter during pre-render would need
 * a Suspense boundary and a hydration decision for a value that means nothing
 * until it is typed.
 */
let query = "";
/* Set back to false whenever the URL may have changed behind the hook's back,
   so the next read takes the query from there instead of the cached value. */
let stale = true;

const listeners = new Set<() => void>();

function readFromUrl(): string {
  return new URLSearchParams(window.location.search).get(QUERY_PARAM) ?? "";
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  const onNavigation = () => {
    stale = true;
    listener();
  };
  window.addEventListener("popstate", onNavigation);
  window.addEventListener("hashchange", onNavigation);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", onNavigation);
    window.removeEventListener("hashchange", onNavigation);
  };
}

function getSnapshot(): string {
  /* The first read takes the query from the URL, so /dashboard?q=tree
     arrives already filtered. Every later read comes from the cache; typing
     is the only other thing that changes it. */
  if (stale) {
    stale = false;
    query = readFromUrl();
  }
  return query;
}

/* The server render never knows the query: the pill starts empty and the
   pre-rendered HTML stays identical for every URL that reaches it, so there
   is nothing to disagree about at hydration. */
function getServerSnapshot(): string {
  return "";
}

function setQuery(next: string): void {
  if (next === query) return;

  query = next;

  const url = new URL(window.location.href);
  if (next) url.searchParams.set(QUERY_PARAM, next);
  else url.searchParams.delete(QUERY_PARAM);
  window.history.replaceState(null, "", url);

  for (const listener of listeners) listener();
}

export function useSearchQuery(): SearchQuery {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const onQuery = useCallback((next: string) => setQuery(next), []);

  return { query: value, onQuery };
}
