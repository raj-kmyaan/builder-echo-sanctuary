import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRole } from "@/context/role";
import { Ticket, getTickets, setTickets } from "@/lib/store";

const KB: { q: string; a: string; tags: string[] }[] = [
  { q: "What are the library hours?", a: "Library is open 8 AM – 10 PM on weekdays and 9 AM – 6 PM on weekends.", tags: ["library","hours"] },
  { q: "How to request bonafide certificate?", a: "Visit the Registrar Office page and submit the online request form. Processing takes 2 working days.", tags: ["certificate","registrar"] },
  { q: "Fee payment deadline", a: "Fees for the current semester are due by the 10th of each month during the fee window.", tags: ["fees","deadline"] },
  { q: "Where is Lab C3?", a: "Lab C3 is located in the Engineering Block, 3rd floor.", tags: ["lab","location"] },
];

function answer(query: string){
  const normalized = query.toLowerCase();
  let best = KB[0];
  let score = 0;
  for (const item of KB){
    let s = 0;
    if (item.q.toLowerCase().includes(normalized)) s += 3;
    for (const t of item.tags) if (normalized.includes(t)) s += 1;
    const overlap = item.q.split(/\s+/).filter(w=> normalized.includes(w.toLowerCase())).length;
    s += overlap * 0.5;
    if (s>score){ score = s; best = item; }
  }
  return best.a + (score<1? "\nTip: Try rephrasing or open a support ticket in the Tickets tab.": "");
}

type Msg = { role: "user"|"assistant"; text: string };

export default function HelpdeskPage(){
  const { user } = useRole();
  const storageKey = `compass:helpdesk:${user.id}`;
  const [msgs, setMsgs] = useState<Msg[]>(()=>{
    const raw = localStorage.getItem(storageKey); return raw? JSON.parse(raw): [{ role: "assistant", text: "Hi! I'm CampusGPT. Ask me about deadlines, locations, or rules." }];
  });
  useEffect(()=>{ localStorage.setItem(storageKey, JSON.stringify(msgs)); }, [msgs, storageKey]);

  const [q, setQ] = useState("");
  const send = () => {
    if (!q.trim()) return; const userMsg: Msg = { role: "user", text: q.trim() };
    const botMsg: Msg = { role: "assistant", text: answer(q.trim()) };
    setMsgs(prev => [...prev, userMsg, botMsg]); setQ("");
  };

  // Tickets
  const [tickets, setLocalTickets] = useState<Ticket[]>(()=> getTickets());
  useEffect(()=>{ setLocalTickets(getTickets()); }, []);
  const [category, setCategory] = useState("General");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const submitTicket = () => {
    if (!subject.trim() || !body.trim()) return;
    const t: Ticket = { id: crypto.randomUUID(), userId: user.id, category, subject: subject.trim(), body: body.trim(), status: "open", createdAt: new Date().toISOString() };
    const next = [t, ...getTickets()]; setTickets(next); setLocalTickets(next);
    setSubject(""); setBody("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Campus Helpdesk</h1>
      <Tabs defaultValue="chat">
        <TabsList>
          <TabsTrigger value="chat">CampusGPT</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Chat</CardTitle></CardHeader>
            <CardContent>
              <ScrollArea className="h-[50vh] rounded-md border p-3 bg-muted/30">
                <div className="space-y-3">
                  {msgs.map((m, i)=> (
                    <div key={i} className={(m.role==='user'? 'justify-end': 'justify-start') + ' flex'}>
                      <div className={(m.role==='user'? 'bg-primary text-primary-foreground': 'bg-background border') + ' max-w-[75%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap'}>{m.text}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-3 flex gap-2">
                <Input placeholder="Ask a question..." value={q} onChange={e=> setQ(e.target.value)} onKeyDown={e=> e.key==='Enter' && send()} />
                <Button onClick={send} className="rounded-lg">Send</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tickets" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Open a Support Ticket</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>Category</Label>
                  <Input value={category} onChange={e=> setCategory(e.target.value)} />
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input value={subject} onChange={e=> setSubject(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Label>Details</Label>
                  <Textarea rows={4} value={body} onChange={e=> setBody(e.target.value)} />
                </div>
                <div className="md:col-span-2"><Button onClick={submitTicket} className="rounded-lg">Submit</Button></div>
              </div>
              <div className="rounded-lg border overflow-x-auto mt-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-3">ID</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(t => (
                      <tr key={t.id} className="border-b">
                        <td className="p-3">{t.id.slice(0,8)}</td>
                        <td className="p-3">{t.subject}</td>
                        <td className="p-3">{t.category}</td>
                        <td className="p-3 capitalize">{t.status.replace('_',' ')}</td>
                        <td className="p-3">{new Date(t.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                    {tickets.length===0 ? <tr><td className="p-3 text-muted-foreground" colSpan={5}>No tickets yet.</td></tr>: null}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
