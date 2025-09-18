import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, MonitorSmartphone, Wifi } from "lucide-react";
import { useRole } from "@/context/role";
import { getEvents, EventItem } from "@/lib/store";

const BUILDINGS = [
  { id: "lib", name: "Central Library", coord: [2, 2] as const, kind: "library" as const },
  { id: "lab-a", name: "Lab Complex A", coord: [4, 3] as const, kind: "lab" as const },
  { id: "gym", name: "Sports Center", coord: [1, 4] as const, kind: "sports" as const },
  { id: "eng", name: "Engineering Block", coord: [5, 2] as const, kind: "academic" as const },
  { id: "caf", name: "Cafeteria", coord: [3, 5] as const, kind: "amenity" as const },
];

type Live = { id: string; occupancy?: number; pcsFree?: number; wifiLoad?: number };

export default function MapPage(){
  const { user } = useRole();
  const [live, setLive] = useState<Record<string, Live>>({});
  const [now, setNow] = useState(() => new Date());
  useEffect(()=>{
    const tick = setInterval(()=>{
      setNow(new Date());
      setLive(prev => {
        const next: Record<string, Live> = { ...prev };
        for (const b of BUILDINGS){
          const base = next[b.id] || { id: b.id };
          next[b.id] = {
            id: b.id,
            occupancy: Math.max(10, Math.min(100, (base.occupancy ?? 50) + (Math.random()*20-10)))|0,
            pcsFree: Math.max(0, (base.pcsFree ?? 20) + Math.round(Math.random()*6-3)),
            wifiLoad: Math.max(10, Math.min(100, (base.wifiLoad ?? 60) + (Math.random()*16-8)))|0,
          };
        }
        return next;
      });
    }, 5000);
    return ()=> clearInterval(tick);
  }, []);

  const events: EventItem[] = getEvents(user.id).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Interactive Campus Map</h1>
        <div className="text-sm text-muted-foreground">Live at {now.toLocaleTimeString()}</div>
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8">
          <CardHeader><CardTitle>Map</CardTitle></CardHeader>
          <CardContent>
            <div className="aspect-[16/9] w-full rounded-lg border bg-grid-slate-100 dark:bg-grid-slate-900 relative overflow-hidden">
              {BUILDINGS.map(b => (
                <button key={b.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${b.coord[0]*16}%`, top: `${b.coord[1]*16}%` }}>
                  <div className="rounded-md border bg-background/90 backdrop-blur px-2 py-1.5 shadow">
                    <div className="text-xs font-medium flex items-center gap-1"><MapPin className="h-3 w-3"/>{b.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>Occ {live[b.id]?.occupancy ?? 50}%</span>
                      {b.kind==="lab" ? <span className="inline-flex items-center gap-1"><MonitorSmartphone className="h-3 w-3"/>{live[b.id]?.pcsFree ?? 20} PCs</span> : null}
                      <span className="inline-flex items-center gap-1"><Wifi className="h-3 w-3"/>{live[b.id]?.wifiLoad ?? 60}%</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-4">
          <CardHeader><CardTitle>Happening Today</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {events.length===0 ? <li className="text-muted-foreground">No upcoming events.</li> : null}
              {events.map(e => (
                <li key={e.id} className="flex items-start justify-between">
                  <div>
                    <div className="font-medium truncate max-w-[240px]">{e.title}</div>
                    <div className="text-muted-foreground flex items-center gap-1"><CalendarDays className="h-3 w-3"/>{new Date(e.start).toLocaleString()}</div>
                  </div>
                  <Badge variant="secondary">Event</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
