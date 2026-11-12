import { QueryClient, isServer } from "@tanstack/react-query";
import { ApiError } from "@/types/api";

/**
 * How this project caches what the backend says.
 *
 * The defaults matter more than they look. A family site is read far more
 * than it is written, over phone connections that come and go, so:
 *
 * - **A minute of staleness is fine.** Nobody needs a second-fresh count of
 *   the albums, and refetching on every focus makes a phone feel busy.
 * - **A failed request is retried twice — unless retrying cannot help.**
 *   There is no point asking a 401, a 403 or a 422 again: the session is
 *   gone, you are not allowed, or what was sent was wrong. `ApiError`
 *   carries the status so this is one line rather than a guess.
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: (failures, error) => {
          if (error instanceof ApiError) {
            if (error.isUnauthorized || error.isForbidden || error.isValidation)
              return false;
          }
          return failures < 2;
        },
      },
      mutations: {
        /* A write is not retried on its own. Sending the same thing twice
           because the first answer was slow is how a post gets published
           twice. */
        retry: false,
      },
    },
  });
}

let browserClient: QueryClient | undefined;

/**
 * One client per browser, a fresh one per server render.
 *
 * On the server every request must have its own cache, or one visitor's
 * data is handed to the next. In the browser the opposite is true: making a
 * new client on a re-render throws away everything already fetched.
 */
export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();
  browserClient ??= makeQueryClient();
  return browserClient;
}
