export const TYPE_COLORS: Record<string, string> = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
};

export function gradientOf(type: string) {
    const base = TYPE_COLORS[type] || "#64748B"; // fallback to gray-500
    return `linear-gradient(135deg, ${base} 0%, ${base}cc 60%, ${base}80 100%)`; // with opacity stops
}