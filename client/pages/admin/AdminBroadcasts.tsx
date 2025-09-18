import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Broadcast, Dept, Year, addBroadcast, getBroadcasts } from "@/lib/store";

export default function AdminBroadcastsPage(){
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dept, setDept] = useState<Dept | "">("");
  const [year, setYear] = useState<Year | "">("");
  const [list, setList] = useState(()=> getBroadcasts());

  const send = () => {
    if (!title.trim() || !body.trim()) return;
    const b: Broadcast = { id: crypto.randomUUID(), title: title.trim(), body: body.trim(), date: new Date().toISOString(), filter: { dept: dept || undefined, year: year || undefined } };
    addBroadcast(b); setList(getBroadcasts()); setTitle(""); setBody(""); setDept(""); setYear("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Targeted Broadcasts</h1>
      <Card>
        <CardHeader><CardTitle>Compose Announcement</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <Label>Title</Label>
            <Input value={title} onChange={e=> setTitle(e.target.value)} placeholder="e.g. Fee Deadline Reminder" />
          </div>
          <div>
            <Label>Department (optional)</Label>
            <Input value={dept as string} onChange={e=> setDept(e.target.value as any)} placeholder="Computer Science" />
          </div>
          <div>
            <Label>Year (optional)</Label>
            <Input value={year as string} onChange={e=> setYear(e.target.value as any)} placeholder="First/Second/Third/Fourth" />
          </div>
          <div className="md:col-span-4">
            <Label>Message</Label>
            <Textarea rows={3} value={body} onChange={e=> setBody(e.target.value)} />
            <div className="mt-3"><Button onClick={send} className="rounded-lg">Send</Button></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Recent Broadcasts</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {list.map(b=> (
              <li key={b.id}>
                <span className="font-medium">{b.title}</span> — {b.body}
                <span className="text-muted-foreground"> {b.filter?.dept || 'All'} • {b.filter?.year || 'All'}</span>
              </li>
            ))}
            {list.length===0? <li className="text-muted-foreground">No broadcasts yet.</li> : null}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
