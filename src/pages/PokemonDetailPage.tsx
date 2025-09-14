import { NavLink, useParams } from "react-router-dom";
import TypeChip from "../components/TypeChip";
import Tabs from "../components/Tabs";
import StatsChart from "../components/StatsChart";
import { gradientOf } from "../lib/theme";
import { officialArtworkUrl, formatName } from "../lib/utils";
import { usePokemon } from "../features/pokemon/usePokemon";
import { apiPokemonDetail, apiSpecies } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";

export default function PokemonDetailPage() {
    const { name } = useParams<{ name: string }>();
    const { detailQ, flavor, evoQ } = usePokemon(name);

    // --- state control yang jelas ---
    if (!name) return <div className="text-slate-600">Invalid URL</div>;
    if (detailQ.isLoading) return <div>Loading...</div>;
    if (detailQ.isError) {
        const msg = (detailQ.error as Error)?.message ?? "Unknown error";
        return (
        <div className="p-4 rounded-xl2 bg-red-50 text-red-700">
            Failed to load <b>{name}</b>: {msg}
        </div>
        );
    }

    // vm directly from detailQ.data (because select: toPokemonVM)
    const vm = detailQ.data!;
    const primaryType = vm.types[0] ?? "normal";
    const bg = gradientOf(primaryType);
    const img = vm.img ?? officialArtworkUrl(vm.id);

    const about = (
        <div className="space-y-2 text-sm">
        <div><span className="text-slate-500">Height:</span> {vm.heightM.toFixed(1)} m</div>
        <div><span className="text-slate-500">Weight:</span> {vm.weightKg.toFixed(1)} kg</div>
        <div><span className="text-slate-500">Abilities:</span> {vm.abilities.join(", ")}</div>
        {flavor && <p className="pt-2 italic text-slate-600">{flavor}</p>}
        </div>
    );

    const stats = vm.stats.map(s => ({ name: s.key.replace("special-", "Sp."), value: s.value }));

    const qc = useQueryClient();
    const evolution = (
        <div className="flex flex-wrap items-center gap-3">
        {evoQ.data?.map((nm) => (
            <NavLink
                key={nm}
                to={`/pokemon/${nm}`}
                end
                onMouseEnter={() => {
                    qc.prefetchQuery({ queryKey: ["pokemon", nm], queryFn: () => apiPokemonDetail(nm) });
                    qc.prefetchQuery({ queryKey: ["species", nm], queryFn: () => apiSpecies(nm) });
                }}
                className={({ isActive }) =>
                    clsx(
                        "px-3 py-1 rounded-xl2 text-sm border transition focus:outline-none",
                        "focus:ring-2 focus:ring-slate-300 focus:ring-offset-2",
                        isActive
                        ? "bg-slate-900 text-white border-slate-900 shadow"
                        : "bg-white/80 text-slate-700 border-black/10 hover:bg-slate-100"
                    )
                }>
            {formatName(nm)}
            </NavLink>
        ))}
        {!evoQ.data?.length && <span className="text-sm text-slate-500">No evolution data</span>}
        </div>
    );

    return (
        <div className="rounded-xl2 shadow-soft overflow-hidden">
        <div className="p-6 text-white" style={{ background: bg }}>
            <div className="flex items-start justify-between">
            <div>
                <h1 className="text-3xl font-extrabold">{formatName(vm.name)}</h1>
                <div className="mt-2 flex gap-2">{vm.types.map(t => <TypeChip key={t} type={t} />)}</div>
            </div>
            <span className="text-white/90 font-semibold text-xl">#{String(vm.id).padStart(3,"0")}</span>
            </div>
            <div className="mt-4">
            <img src={img} alt={vm.name} className="h-44 drop-shadow-xl" />
            </div>
        </div>

        <div className="bg-white/80 dark:bg-white/5 p-6">
            <Tabs tabs={[
            { key: "about", label: "About", content: about },
            { key: "stats", label: "Base Stats", content: <StatsChart stats={stats} /> },
            { key: "evo", label: "Evolution", content: evolution },
            ]}/>
        </div>
        </div>
    );
}
