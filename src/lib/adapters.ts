import type { PokemonDetailT } from "./api";

// toVM = convert to View Model
export function toPokemonVM(p: PokemonDetailT) {
    return {
        id: p.id,
        name: p.name,
        types: p.types.map(t => t.type.name),
        stats: p.stats.map(s => ({
            key: s.stat.name,
            value: s.base_stat
        })),
        heightM: p.height / 10, // decimeter to meter
        weightKg: p.weight / 10, // hectogram to kilogram
        abilities: p.abilities.map(a => a.ability.name),
        img: p.sprites?.other?.["official-artwork"]?.front_default || null
    }
}