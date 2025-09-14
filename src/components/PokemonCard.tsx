import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiPokemonDetail } from "../lib/api";
import { formatName, getIdFromUrl, officialArtworkUrl } from "../lib/utils";
import TypeChip from "./TypeChip";

type Props = { name: string; url: string };

export default function PokemonCard({ name, url }: Props) {
    const id = useMemo(() => getIdFromUrl(url), [url]);
    const img = officialArtworkUrl(id);

    // visible = kartu sudah masuk viewport → baru fetch detail
    const [visible, setVisible] = useState(false);
    const rootRef = useRef<HTMLAnchorElement | null>(null);
    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
        }
        }, { root: null, rootMargin: "400px" }); // prefetch sedikit sebelum kelihatan
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const qc = useQueryClient();
    // Fetch detail (types, dll) hanya saat visible
    const { data, isLoading, isError } = useQuery({
        queryKey: ["pokemon", name],
        queryFn: () => apiPokemonDetail(name),
        enabled: visible,
        retry: 1,
        staleTime: 600_000
    });

    // Prefetch untuk navigasi makin ngebut
    function prefetch() {
        qc.prefetchQuery({ queryKey: ["pokemon", name], queryFn: () => apiPokemonDetail(name) });
    }

    return (
        <Link
        ref={rootRef}
        to={`/pokemon/${name}`}
        onMouseEnter={prefetch}
        className="block rounded-2xl shadow-soft bg-white/80 dark:bg-white/5 hover:scale-[1.02] transition"
        >
        <div className="p-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white/60 dark:bg-black/20 grid place-items-center">
            <img src={img} alt={name} className="h-28 object-contain" loading="lazy" />
            </div>

            <div className="mt-3 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{formatName(name)}</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">#{String(id).padStart(3, "0")}</span>
            </div>

            <div className="mt-2 flex gap-2">
            {/* -- Tiga state: loading detail, sukses, atau error -- */}
            {isLoading && <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />}
            {data && data.types.map(t => <TypeChip key={t.type.name} type={t.type.name} />)}
            {isError && <span className="text-xs text-slate-500">types unavailable</span>}
            </div>
        </div>
        </Link>
    );
}
