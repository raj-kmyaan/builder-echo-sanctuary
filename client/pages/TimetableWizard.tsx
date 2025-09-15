import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const COURSES: { code: string; title: string; }[] = [
  { code: "CS101", title: "Data Structures" },
  { code: "CS102", title: "Algorithms" },
  { code: "CS201", title: "DBMS" },
  { code: "CS202", title: "Operating Systems" },
  { code: "CS210", title: "Networks" },
];

const PROFESSORS = ["Dr. Rao", "Prof. Sharma", "Dr. Lin", "Dr. Gomez", "Prof. Blake"];

type Prefs = { morning: boolean; afternoon: boolean; avoidGaps: boolean; prioritized: string[] };

function genOptions(selected: string[], prefs: Prefs) {
  const baseTimes = [9, 10, 11, 12, 14, 15, 16];
  const days = ["Mon","Tue","Wed","Thu","Fri"];
  const slots = selected.map((c, idx) => ({
    course: c,
    day: days[idx % days.length],
    time: baseTimes[(prefs.morning ? idx : baseTimes.length-1-idx) % baseTimes.length],
    duration: 1,
  }));
  const opt1 = slots;
  const opt2 = slots.map((s, i) => ({ ...s, time: prefs.morning ? 9 + (i%3) : 13 + (i%3) }));
  const opt3 = slots.map((s, i) => ({ ...s, day: days[(i+2)%days.length] }));
  return [
    { key: "balanced", label: "Option 1 (Balanced)", blocks: opt1 },
    { key: "morning", label: "Option 2 (Morning Focused)", blocks: opt2 },
    { key: "spread", label: "Option 3 (Spread)", blocks: opt3 },
  ];
}

function CalendarView({ blocks }: { blocks: { course: string; day: string; time: number; duration: number }[] }) {
  const days = ["Mon","Tue","Wed","Thu","Fri"];
  const times = [9,10,11,12,13,14,15,16,17];
  return (
    <div className="w-full overflow-x-auto">
      <div className="grid" style={{ gridTemplateColumns: `120px repeat(${days.length}, 1fr)` }}>
        <div />{days.map(d => <div key={d} className="p-2 text-sm font-medium text-center">{d}</div>)}
        {times.map(t => (
          <>
            <div key={`t-${t}`} className="border-t p-2 text-xs text-muted-foreground">{t}:00</div>
            {days.map((d) => (
              <div key={`${d}-${t}`} className="border-t border-l relative h-16">
                {blocks.filter(b=>b.day===d && b.time===t).map((b, i)=>(
                  <div key={`${b.course}-${i}`} className="absolute inset-1 rounded-md bg-primary/10 border border-primary/30 p-2 text-xs">
                    <div className="font-medium">{b.course}</div>
                    <div className="text-muted-foreground">{t}:00–{t + b.duration}:00</div>
                  </div>
                ))}
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
}

export default function TimetableWizardPage() {
  const [step, setStep] = useState<1|2|3>(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [prefs, setPrefs] = useState<Prefs>({ morning: true, afternoon: false, avoidGaps: true, prioritized: [] });
  const options = useMemo(()=> genOptions(selected, prefs), [selected, prefs]);
  const [active, setActive] = useState(options[0]?.key || "balanced");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Automated Timetable Wizard</h1>
      </div>

      {step===1 && (
        <Card>
          <CardHeader><CardTitle>Step 1: Course Selection</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Available Courses</h3>
                <div className="space-y-2">
                  {COURSES.map(c => (
                    <label key={c.code} className="flex items-center gap-3 rounded-md border p-2">
                      <Checkbox checked={selected.includes(c.title)} onCheckedChange={(v)=> setSelected(prev => v ? [...prev, c.title] : prev.filter(x=>x!==c.title))} />
                      <div>
                        <div className="font-medium">{c.title}</div>
                        <div className="text-xs text-muted-foreground">{c.code}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Selected</h3>
                <div className="min-h-40 rounded-md border p-3 space-x-2">
                  {selected.length===0 ? (
                    <div className="text-sm text-muted-foreground">No courses selected yet.</div>
                  ) : selected.map(s => (<Badge key={s} className="mr-2 mb-2 inline-flex">{s}</Badge>))}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button disabled={selected.length===0} onClick={()=> setStep(2)} className="rounded-lg">Next: Set Preferences</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step===2 && (
        <Card>
          <CardHeader><CardTitle>Step 2: Scheduling Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex items-center justify-between rounded-md border p-3">
                <Label>Prefer Morning Classes</Label>
                <Switch checked={prefs.morning} onCheckedChange={(v)=> setPrefs(p=>({ ...p, morning: !!v }))} />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <Label>Prefer Afternoon Classes</Label>
                <Switch checked={prefs.afternoon} onCheckedChange={(v)=> setPrefs(p=>({ ...p, afternoon: !!v }))} />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <Label>Avoid Long Gaps</Label>
                <Switch checked={prefs.avoidGaps} onCheckedChange={(v)=> setPrefs(p=>({ ...p, avoidGaps: !!v }))} />
              </div>
            </div>
            <div>
              <Label>Prioritize these Professors</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="mt-2 rounded-lg">{prefs.prioritized.length? prefs.prioritized.join(", ") : "Select Professors"}</Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-2">
                    {PROFESSORS.map((p)=> (
                      <label key={p} className="flex items-center gap-2">
                        <Checkbox checked={prefs.prioritized.includes(p)} onCheckedChange={(v)=> setPrefs(prev => ({ ...prev, prioritized: v ? [...prev.prioritized, p] : prev.prioritized.filter(x=>x!==p) }))} />
                        <span>{p}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={()=> setStep(1)} className="rounded-lg">Back</Button>
              <Button onClick={()=> setStep(3)} className="rounded-lg">Generate Timetables</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step===3 && (
        <Card>
          <CardHeader><CardTitle>Step 3: Your Timetable Options</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={active} onValueChange={setActive}>
              <TabsList className="mb-4">
                {options.map(o => (<TabsTrigger key={o.key} value={o.key}>{o.label}</TabsTrigger>))}
              </TabsList>
              {options.map(o => (
                <TabsContent key={o.key} value={o.key} className="space-y-4">
                  <CalendarView blocks={o.blocks} />
                </TabsContent>
              ))}
            </Tabs>
            <div className="flex justify-end">
              <Button size="lg" className="rounded-lg">Confirm & Register This Schedule</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
