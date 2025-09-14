import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Row = { name: string; value: number }

export default function StatsChart({ stats }: { stats: Row[] }) {
    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats} layout="vertical" margin={{ left: 24, right: 24 }}>
                    <XAxis type="number" domain={[0, 200]} hide />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6,6,6,6]}>
                        <LabelList dataKey="value" position="right" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}