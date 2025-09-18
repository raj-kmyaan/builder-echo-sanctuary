import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/context/role";
import { getTimetable, setEvents } from "@/lib/store";

const PEERS = [
  { id: "p1", name: "Samiksha Patel", skills: ["DSA","React"], looking: ["DBMS"] },
  { id: "p2", name: "Michael Chen", skills: ["Calculus","Physics"], looking: ["Algorithms"] },
  { id: "p3", name: "Isha Rao", skills: ["DBMS","Networks"], looking: ["OS"] },
];

export default function StudyGroupsPage(){
  const { user } = useRole();
  const tt = getTimetable(user.id);
  const myInterests = useMemo(()=> Array.from(new Set(tt.map(b=> b.course))), [tt]);
  const [topic, setTopic] = useState("");
  const suggestions = useMemo(()=> PEERS.filter(p=> p.looking.some(l=> myInterests.includes(l)) || (topic && p.looking.some(l=> topic.toLowerCase().includes(l.toLowerCase())))), [myInterests, topic]);

  const invite = (peer:{id:string; name:string}) => {
    const start = new Date(); start.setHours(start.getHours()+24, 0, 0, 0);
    const event = { id: crypto.randomUUID(), title: `Study Group: ${topic || 'General'} with ${peer.name}` , start: start.toISOString(), location: "Library A-204" };
    const existing = JSON.parse(localStorage.getItem(`compass:events:${user.id}`) || "[]");
    setEvents(user.id, [event, ...existing]);
    alert(`Invite sent to ${peer.name}. Event added to your calendar.`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">AI Study Group Formation</h1>
      <Card>
        <CardHeader><CardTitle>Find Partners</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Topic or Course</Label>
            <Input value={topic} onChange={e=> setTopic(e.target.value)} placeholder="e.g. DBMS ER Modelling" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Your courses: {myInterests.length? myInterests.map(c=> <Badge key={c} className="mr-1">{c}</Badge>): 'No timetable saved yet.'}</div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {suggestions.map(p=> (
              <Card key={p.id}>
                <CardHeader><CardTitle className="text-base">{p.name}</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-sm">Skills: {p.skills.map(s=> <Badge key={s} variant="secondary" className="mr-1">{s}</Badge>)}</div>
                  <div className="text-sm mt-1">Looking for: {p.looking.map(s=> <Badge key={s} variant="outline" className="mr-1">{s}</Badge>)}</div>
                  <div className="mt-3"><Button onClick={()=> invite(p)} className="rounded-lg">Invite</Button></div>
                </CardContent>
              </Card>
            ))}
            {suggestions.length===0 ? <Card className="md:col-span-3"><CardContent className="p-6 text-sm text-muted-foreground">No suggestions yet. Save a timetable or enter a topic.</CardContent></Card> : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
