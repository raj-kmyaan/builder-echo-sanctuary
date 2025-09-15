import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";

export default function AttendanceDonutChart({ percentage, breakdown }: { percentage: number; breakdown: { present: number; absent: number } }) {
  const data = [
    { name: "Present", value: breakdown.present, fill: "#16A34A" },
    { name: "Absent", value: breakdown.absent, fill: "#DC2626" },
  ];

  return (
    <div className="relative">
      <ChartContainer config={{}} className="h-56">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} strokeWidth={4}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ChartContainer>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-3xl font-bold">{percentage}%</div>
          <div className="text-xs text-muted-foreground">Overall</div>
        </div>
      </div>
    </div>
  );
}
