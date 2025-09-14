import z from "zod";

const BASE = "https://pokeapi.co/api/v2";

// fetch json helper
async function fjson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${url}`);
    return res.json() as Promise<T>;
}

// zod schemas minimum
const PokeListItem = z.object({ name: z.string(), url: z.string() });
const PokeList = z.object({
    next: z.string().nullable(),
    results: z.array(PokeListItem),
});
export type PokeListItemT = z.infer<typeof PokeListItem>;

const PokemonDetail = z.object({
    id: z.number(),
    name: z.string(),
    types: z.array(z.object({
        slot: z.number(),
        type: z.object({ name: z.string(), url: z.string() })
    })),
    stats: z.array(z.object({
        base_stat: z.number(),
        stat: z.object({ name: z.string() })
    })),
    height: z.number(),
    weight: z.number(),
    abilities: z.array(z.object({
        ability: z.object({ name: z.string() })
    })),
    sprites: z.object({
        other: z.object({
            ["official-artwork"]: z.object({
                front_default: z.string().nullable()
            }).optional()
        }).partial()
    }).partial()
});

export type PokemonDetailT = z.infer<typeof PokemonDetail>;

const Species = z.object({
    flavor_text_entries: z.array(z.object({
        flavor_text: z.string(),
        language: z.object({ name: z.string() })
    })),
    evolution_chain: z.object({ url: z.string() })
});
export type SpeciesT = z.infer<typeof Species>;

const EvolutionChain = z.object({
    chain: z.object({
        species: z.object({ name: z.string() }),
        evolves_to: z.array(z.any()) // recursive, will parse manually
    })
});

// endpoints
export async function apiListPokemons(limit: number, offset: number) {
    const raw = await fjson(`${BASE}/pokemon?limit=${limit}&offset=${offset}`);
    return PokeList.parse(raw);
}
export async function apiPokemonDetail(nameOrId: string |  number) {
    const raw = await fjson(`${BASE}/pokemon/${nameOrId}`);
    return PokemonDetail.parse(raw);
}
export async function apiSpecies(nameOrId: string | number) {
    const raw = await fjson(`${BASE}/pokemon-species/${nameOrId}`);
    return Species.parse(raw);
}
export async function apiEvolutionName(nameOrId: string | number): Promise<string[]> {
    const sp = await apiSpecies(nameOrId);
    const evRaw = await fjson<unknown>(sp.evolution_chain.url);
    const ev = EvolutionChain.parse(evRaw);

    const name: string[] = [];
    // depth first search to extract names
    function dfs(node: any) {
        if (node?.species?.name) {
            name.push(node.species.name);
        }
        if (Array.isArray(node?.evolves_to)) {
            for (const child of node.evolves_to) {
                dfs(child);
            }
        }
    }
    dfs(ev.chain);
    return Array.from(new Set(name)); // unique
}

// helpers
export function flavorEN(sp: SpeciesT) {
    const it = sp.flavor_text_entries.find(e => e.language.name === "en");
    return it?.flavor_text?.replace(/\s+/g, " ") ?? "";
}