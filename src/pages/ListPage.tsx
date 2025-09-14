import { useSearchParams } from "react-router-dom";
import { usePokedex } from "../features/pokedex/usePokedex";
import { useCallback, useMemo } from "react";
import { useIO } from "../lib/utils";
import PokemonCard from "../components/PokemonCard";

export default function ListPage() {
    const [params, setParams] = useSearchParams()
    const q = params.get("q") ?? ""

    const setQ = (val: string) => setParams({ q: val}, { replace: true })

    const { query, items} = usePokedex(q);

    const onIntersect = useCallback(() => {
        if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage()
    }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage])

    const { elRef, setEnabled } = useIO<HTMLDivElement>(onIntersect)

    useMemo(() => setEnabled(Boolean(query.hasNextPage)), [query.hasNextPage, setEnabled])

    return (
        <div>
            {/* Search */}
            <div className="mb-4 flex items-center gap-3">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search Pokemon by name (e.g. bulbasaur)"
                    className="w-full px-3 py-2 rounded-xl2 bg-white/70 dark:bg-white/5 border border-black/10 focus:outline-none"
                />
            </div>

            {/* Grid List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map(it => (
                    <PokemonCard key={it.name} name={it.name} url={it.url} />
                ))}
            </div>

            {/* Sentinel for infinite scroll */}
            <div ref={elRef} className="h-10" />

            {/* Status */}
            <div className="mt-6 text-center text-sm text-slate-500">
                {query.isFetchingNextPage ? "Loading more..." : query.hasNextPage ? "" : "No More Pokemon"}
            </div>
        </div>
    )
}