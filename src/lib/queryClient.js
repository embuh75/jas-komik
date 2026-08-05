import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // gcTime: 1000 * 60 * 60 * 24, // 24 hours
      gcTime: 1000 * 60 * 10,
    },
  },
});

export const persister = createAsyncStoragePersister({
  storage: window.localStorage,
});
