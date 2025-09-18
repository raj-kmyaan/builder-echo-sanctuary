import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRole } from "@/context/role";
import { Booking, getBookings, setBookings } from "@/lib/store";
import { Calendar as DatePicker } from "@/components/ui/calendar";

const RESOURCES = [
  { id: "room-a1", name: "Study Room A1", type: "Study Room" },
  { id: "room-a2", name: "Study Room A2", type: "Study Room" },
  { id: "lab-c3", name: "Computer Lab C3", type: "Lab" },
  { id: "court-1", name: "Badminton Court 1", type: "Sports" },
];

export default function ResourceBookingPage(){
  const { user } = useRole();
  const [resource, setResource] = useState<string>(RESOURCES[0].id);
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [title, setTitle] = useState("");

  const list = getBookings(resource);
  const dayKey = selected ? selected.toISOString().slice(0,10) : "";
  const dayBookings = useMemo(()=> list.filter(b=> b.start.slice(0,10)===dayKey), [list, dayKey]);

  const add = () => {
    if (!selected || !title.trim()) return;
    const s = new Date(`${dayKey}T${start}`);
    const e = new Date(`${dayKey}T${end}`);
    const b: Booking = { id: crypto.randomUUID(), resourceId: resource, title: title.trim(), start: s.toISOString(), end: e.toISOString(), userId: user.id };
    const next = [b, ...getBookings(resource)];
    setBookings(resource, next);
    setTitle("");
  };
  const remove = (id:string) => { const next = getBookings(resource).filter(b=> b.id!==id); setBookings(resource, next); };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Resource Booking</h1>
      <Card>
        <CardHeader><CardTitle>Reserve a Facility</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-12">
            <div className="md:col-span-4">
              <Label>Resource</Label>
              <Select value={resource} onValueChange={setResource}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {RESOURCES.map(r=> <SelectItem key={r.id} value={r.id}>{r.name} — {r.type}</SelectItem>)}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-4">
              <Label>Date</Label>
              <DatePicker mode="single" selected={selected} onSelect={setSelected} className="rounded-md border" />
            </div>
            <div className="md:col-span-4 grid grid-cols-2 gap-3">
              <div>
                <Label>Start</Label>
                <Input type="time" value={start} onChange={e=> setStart(e.target.value)} />
              </div>
              <div>
                <Label>End</Label>
                <Input type="time" value={end} onChange={e=> setEnd(e.target.value)} />
              </div>
              <div className="col-span-2">
                <Label>Purpose</Label>
                <Input value={title} onChange={e=> setTitle(e.target.value)} placeholder="Group study for DS" />
              </div>
              <div className="col-span-2"><Button onClick={add} className="rounded-lg">Book</Button></div>
            </div>
          </div>
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-3">When</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">By</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dayBookings.map(b=> (
                  <tr key={b.id} className="border-b">
                    <td className="p-3">{new Date(b.start).toLocaleTimeString()}–{new Date(b.end).toLocaleTimeString()}</td>
                    <td className="p-3">{b.title}</td>
                    <td className="p-3">{b.userId}</td>
                    <td className="p-3"><Button size="sm" variant="outline" className="text-red-600" onClick={()=> remove(b.id)}>Cancel</Button></td>
                  </tr>
                ))}
                {dayBookings.length===0 ? <tr><td colSpan={4} className="p-3 text-muted-foreground">No bookings for this date.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
