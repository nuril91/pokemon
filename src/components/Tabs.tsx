import { useId, useState, type ReactNode } from "react";

type Tab = { key: string; label: string; content: ReactNode }

export default function Tabs({ tabs }: { tabs: Tab[] }) {
    const [active, setActive] = useState(tabs[0].key)
    const baseId = useId

    return (
        <div>
            <div role="tablist" aria-label="Pokemon detail tabs" className="flex gap-6 border-b border-black/10">
                {tabs.map((t, i) => {
                    const tid = `${baseId}-tab-${i}`
                    const pid = `${baseId}-panel-${i}`
                    const isActive = active === t.key

                    return (
                        <button
                            key={t.key}
                            id={tid}
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={pid}
                            onClick={() => setActive(t.key)}
                            className={`py-2 -mb-px border-b-2 ${
                                isActive ? "border-black dark:border-white font-semibold" : "border-transparent text-slate-500"}`}
                        >
                            {t.label}
                        </button>
                    )
                })}
            </div>
            {tabs.map((t, i) => {
                const pid = `${baseId}-panel-${i}`
                const tid = `${baseId}-tab-${i}`
                const isActive = active === t.key

                return (
                    <div key={t.key} id={pid} role="tabpanel" aria-labelledby={tid} hidden={!isActive} className="pt-4">
                        {isActive && t.content}
                    </div>
                )
            })}
        </div>
    )
}