import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRole } from "@/context/role";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { EventItem, getEvents, setEvents } from "@/lib/store";
import { format } from "date-fns";

function fmtDate(date: Date){ return format(date, "yyyy-MM-dd"); }
function fmtDT(date: Date){
  const pad = (n:number)=> String(n).padStart(2,"0");
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth()+1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00Z`;
}

function toICS(events: EventItem[]) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Compass//Calendar//EN",
  ];
  for (const e of events) {
    const start = fmtDT(new Date(e.start));
    const end = fmtDT(e.end ? new Date(e.end) : new Date(new Date(e.start).getTime() + 60*60*1000));
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.id}@compass`,
      `DTSTAMP:${fmtDT(new Date())}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${e.title.replace(/\n/g, " ")}`,
      e.location ? `LOCATION:${e.location}` : undefined,
      e.description ? `DESCRIPTION:${e.description.replace(/\n/g, " ")}` : undefined,
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.filter(Boolean).join("\r\n");
}

function parseICS(ics: string): Omit<EventItem, "id">[] {
  const events: Omit<EventItem, "id">[] = [];
  const blocks = ics.split(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) // will not capture; fallback below
  if (blocks.length<=1){
    const lines = ics.split(/\r?\n/);
    let cur: any = null;
    for (const raw of lines){
      const line = raw.trim();
      if (line === "BEGIN:VEVENT") cur = {};
      else if (line === "END:VEVENT" && cur){
        if (cur.DTSTART && cur.SUMMARY){
          const start = cur.DTSTART.value;
          const end = cur.DTEND?.value;
          events.push({ title: cur.SUMMARY.value, start: start.includes("T")? new Date(start).toISOString(): start, end: end? (end.includes("T")? new Date(end).toISOString(): end): undefined, location: cur.LOCATION?.value, description: cur.DESCRIPTION?.value });
        }
        cur = null;
      } else if (cur){
        const [k, ...rest] = line.split(":");
        cur[k] = { value: rest.join(":") };
      }
    }
  }
  return events;
}

export default function CalendarPage(){
  const { user } = useRole();
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [list, setList] = useState<EventItem[]>(()=> getEvents(user.id));
  useEffect(()=>{ setList(getEvents(user.id)); }, [user.id]);

  const dayKey = selected ? fmtDate(selected) : "";
  const dayEvents = useMemo(()=> list.filter(e=> e.start.slice(0,10)===dayKey), [list, dayKey]);

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [loc, setLoc] = useState("");
  const [desc, setDesc] = useState("");

  const add = () => {
    if (!selected || !title.trim()) return;
    const start = new Date(`${fmtDate(selected)}T${time}`);
    const e: EventItem = { id: crypto.randomUUID(), title: title.trim(), start: start.toISOString(), location: loc || undefined, description: desc || undefined };
    const next = [e, ...list];
    setList(next); setEvents(user.id, next);
    setTitle(""); setLoc(""); setDesc("");
  };

  const remove = (id:string) => { const next = list.filter(e=> e.id!==id); setList(next); setEvents(user.id, next); };
  const exportICS = () => {
    const ics = toICS(list);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "compass-events.ics"; a.click(); URL.revokeObjectURL(url);
  };

  const [icsText, setIcsText] = useState("");
  const importICS = () => {
    const parsed = parseICS(icsText);
    if (parsed.length){
      const next = [
        ...parsed.map(p=> ({ id: crypto.randomUUID(), ...p })),
        ...list,
      ];
      setList(next); setEvents(user.id, next); setIcsText("");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Calendar</h1>
      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-4 lg:col-span-3">
          <CardHeader><CardTitle>Select Date</CardTitle></CardHeader>
          <CardContent>
            <DatePicker mode="single" selected={selected} onSelect={setSelected} className="rounded-md border" />
          </CardContent>
        </Card>
        <Card className="md:col-span-8 lg:col-span-9">
          <CardHeader><CardTitle>Events on {selected? fmtDate(selected): "—"}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-4">
              <div className="md:col-span-2">
                <Label>Title</Label>
                <Input value={title} onChange={e=> setTitle(e.target.value)} placeholder="Event title" />
              </div>
              <div>
                <Label>Time</Label>
                <Input type="time" value={time} onChange={e=> setTime(e.target.value)} />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={loc} onChange={e=> setLoc(e.target.value)} placeholder="Room A-204" />
              </div>
              <div className="md:col-span-4">
                <Label>Description</Label>
                <Textarea rows={2} value={desc} onChange={e=> setDesc(e.target.value)} placeholder="Notes" />
                <div className="mt-3"><Button onClick={add} className="rounded-lg">Add Event</Button></div>
              </div>
            </div>

            <div className="rounded-lg border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-3">When</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dayEvents.map(e=> (
                    <tr key={e.id} className="border-b">
                      <td className="p-3">{new Date(e.start).toLocaleTimeString()}</td>
                      <td className="p-3">{e.title}</td>
                      <td className="p-3">{e.location || "—"}</td>
                      <td className="p-3"><Button size="sm" variant="outline" className="text-red-600" onClick={()=> remove(e.id)}>Delete</Button></td>
                    </tr>
                  ))}
                  {dayEvents.length===0 ? <tr><td className="p-3 text-muted-foreground" colSpan={4}>No events for this date.</td></tr> : null}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={exportICS} className="rounded-lg">Export .ics</Button>
              <div className="flex-1 min-w-[280px]">
                <Label>Import .ics (paste content)</Label>
                <Textarea rows={3} value={icsText} onChange={e=> setIcsText(e.target.value)} placeholder="Paste iCalendar content here" />
                <div className="mt-2"><Button onClick={importICS} className="rounded-lg">Import</Button></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
