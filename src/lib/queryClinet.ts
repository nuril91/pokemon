import { QueryClient } from "@tanstack/react-query";

export const qc = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 600_000, // cache 10 minutes
            refetchOnWindowFocus: false,
            retry: 1,
            gcTime: 30 * 60_000, // garbage collect after 30 minutes
        }
    }
})