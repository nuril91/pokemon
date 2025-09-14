import { useInfiniteQuery } from "@tanstack/react-query";
import { apiListPokemons } from "../../lib/api";
import { useMemo } from "react";

const LIMIT = 24;

// q = search query
export function usePokedex(q: string) {
    const query = useInfiniteQuery({
        queryKey: ["list", LIMIT],
        queryFn: ({ pageParam }) => apiListPokemons(LIMIT, pageParam ?? 0),
        getNextPageParam: (lastPage) => {
            if (!lastPage.next) return undefined;
            const url = new URL(lastPage.next);
            return Number(url.searchParams.get("offset") ?? 0);
        },
        initialPageParam: 0
    });

    const items = useMemo(() => {
        const flat = (query.data?.pages ?? []).flatMap(p => p.results);
        return q.trim() ? flat.filter(it => it.name.includes(q.toLowerCase())) : flat;
    }, [query.data, q])

    return { query, items, LIMIT } as const;
}