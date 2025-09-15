import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const alerts = [
  { name: "Samiksha Patel", reason: "Attendance dropped 20% this week", tags: ["Attendance"], photo: "/placeholder.svg" },
  { name: "Michael Chen", reason: "Missed Midterm Exam", tags: ["Grades"], photo: "/placeholder.svg" },
];

const pulseData = [
  { label: "Understanding", value: 68 },
  { label: "Confused", value: 18 },
  { label: "Neutral", value: 14 },
];

const tasks = [
  "Grade Quiz 2 for CS101",
  "Review 3 new support tickets",
  "Prepare slides for next lecture",
];

export default function FacultyDashboard() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <Card className="border-amber-300/40">
          <CardHeader>
            <CardTitle>Compass Alerts: Students at Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((a, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <img src={a.photo} className="h-10 w-10 rounded-full object-cover" alt="" />
                    <div>
                      <div className="font-medium">{a.name}</div>
                      <div className="text-sm text-muted-foreground">{a.reason}</div>
                      <div className="mt-1 flex gap-1">
                        {a.tags.map((t) => (
                          <Badge key={t} variant="secondary" className="rounded-md">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" className="rounded-lg">View Profile</Button>
                    <Button className="rounded-lg">Offer Support</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Classes Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["CS101 - 9:00 AM", "MA102 - 11:00 AM", "PH110 - 2:30 PM"].map((c) => (
                <div key={c} className="flex items-center justify-between rounded-md border p-3">
                  <span>{c}</span>
                  <Button className="rounded-lg" variant="outline">Take Attendance</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Live Class Pulse</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ value: { label: "Metric" } }} className="h-48">
              <BarChart data={pulseData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis hide />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6,6,0,0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm space-y-2">
              {tasks.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
