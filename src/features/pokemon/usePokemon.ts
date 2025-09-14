import { useQuery } from "@tanstack/react-query";
import { apiPokemonDetail, apiSpecies, apiEvolutionName, flavorEN } from "../../lib/api";
import { toPokemonVM } from "../../lib/adapters";

export function usePokemon(name?: string) {
    const enabled = !!name; // only fetch if there is a name

    // detailQ: main query. select = change data API -> ViewModel (VM)
    const detailQ = useQuery({
        enabled,
        queryKey: ["pokemon", name],
        queryFn: () => apiPokemonDetail(name!),    // name! safe because enabled=!!name
        select: toPokemonVM,                 // => detailQ.data directly in the form of VM
        retry: 1,
        staleTime: 600_000
    });

    // companion (may fail without blocking UI)
    const speciesQ = useQuery({
        enabled,
        queryKey: ["species", name],
        queryFn: () => apiSpecies(name!),
        retry: 1,
        staleTime: 600_000
    });

    const evoQ = useQuery({
        enabled,
        queryKey: ["evo", name],
        queryFn: () => apiEvolutionName(name!),
        retry: 1,
        staleTime: 600_000
    });

    const flavor = speciesQ.data ? flavorEN(speciesQ.data) : "";

    return { detailQ, speciesQ, evoQ, flavor } as const;
}
