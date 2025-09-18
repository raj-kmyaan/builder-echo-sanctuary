import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRole } from "@/context/role";
import { getNotes, setNotes, Note } from "@/lib/store";
import { Plus } from "lucide-react";

export default function NotesPage(){
  const { user } = useRole();
  const [notes, setLocalNotes] = useState<Note[]>(()=> getNotes(user.id));
  const [activeId, setActiveId] = useState<string | null>(notes[0]?.id || null);
  useEffect(()=>{ const n = getNotes(user.id); setLocalNotes(n); setActiveId(n[0]?.id || null); }, [user.id]);

  const active = useMemo(()=> notes.find(n=> n.id===activeId) || null, [notes, activeId]);
  const saveAll = (next: Note[]) => { setLocalNotes(next); setNotes(user.id, next); };

  const add = () => {
    const n: Note = { id: crypto.randomUUID(), title: "Untitled", content: "", updatedAt: new Date().toISOString() };
    saveAll([n, ...notes]);
    setActiveId(n.id);
  };
  const remove = (id:string) => {
    const next = notes.filter(n=> n.id!==id);
    saveAll(next);
    if (activeId===id) setActiveId(next[0]?.id || null);
  };
  const update = (patch: Partial<Note>) => {
    if (!active) return;
    const next = notes.map(n=> n.id!==active.id ? n : { ...n, ...patch, updatedAt: new Date().toISOString() });
    saveAll(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notes</h1>
        <Button onClick={add} className="rounded-lg"><Plus className="mr-2 h-4 w-4"/>New Note</Button>
      </div>
      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-4 lg:col-span-3">
          <CardHeader><CardTitle>All Notes</CardTitle></CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[70vh]">
              <ul>
                {notes.map(n=> (
                  <li key={n.id} className={(activeId===n.id?"bg-accent":"") + " border-b p-3 flex items-center justify-between"}>
                    <button onClick={()=> setActiveId(n.id)} className="text-left">
                      <div className="font-medium truncate max-w-[240px]">{n.title || "Untitled"}</div>
                      <div className="text-xs text-muted-foreground">{new Date(n.updatedAt).toLocaleString()}</div>
                    </button>
                    <Button size="sm" variant="ghost" className="text-red-600" onClick={()=> remove(n.id)}>Delete</Button>
                  </li>
                ))}
                {notes.length===0 ? <li className="p-3 text-sm text-muted-foreground">No notes yet.</li> : null}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="md:col-span-8 lg:col-span-9">
          <CardHeader><CardTitle>Editor</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {!active ? (
              <div className="text-sm text-muted-foreground">Create a note to start writing.</div>
            ) : (
              <>
                <div>
                  <Label>Title</Label>
                  <Input value={active.title} onChange={e=> update({ title: e.target.value })} placeholder="Title" />
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea rows={16} value={active.content} onChange={e=> update({ content: e.target.value })} placeholder="Write your note..." />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
