import { useEffect, useRef, useState } from "react";

export const formatName = (name: string) => name ? name[0].toUpperCase() + name.slice(1) : name;

// fallback image url if the pokemon data has no image
export const officialArtworkUrl = (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export function useIO<T extends HTMLElement>(onIntersect: () => void, rootMargin = "600px") {
    const elRef = useRef<T|null>(null);
    const [enabled, setEnabled] = useState(true); // disable when no more pages

    useEffect(() => {
        if (!enabled || !elRef.current) return;
        const io = new IntersectionObserver(([ent]) => {
            if (ent.isIntersecting) onIntersect();
        }, { root: null, rootMargin, threshold: 0.1 });
        io.observe(elRef.current);
        return () => io.disconnect();

    }, [enabled, onIntersect, rootMargin]);

    return { elRef, setEnabled } as const;
}

export function getIdFromUrl(url: string): number {
  // URL: https://pokeapi.co/api/v2/pokemon/1/
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}