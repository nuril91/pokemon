import { TYPE_COLORS } from "../lib/theme";
import clsx from "clsx";

export default function TypeChip({ type }: { type: string }) {
    const bg = TYPE_COLORS[type] ?? "#94a3b8"
    return (
        <span className={clsx("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shadow-sm")}
            style={{ backgroundColor: bg, color: "#fff" }}>
                { type }
        </span>
    )
}