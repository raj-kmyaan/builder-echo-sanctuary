import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/context/role";
import { getTasks, setTasks, Task } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Bell } from "lucide-react";

function Column({ title, tasks, onMove, onRemove }:{ title:string; tasks:Task[]; onMove:(id:string, dir:-1|1)=>void; onRemove:(id:string)=>void }){
  return (
    <Card>
      <CardHeader><CardTitle>{title} <span className="text-xs text-muted-foreground">({tasks.length})</span></CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {tasks.length===0 ? (
          <div className="text-sm text-muted-foreground">No items.</div>
        ) : tasks.map(t => (
          <div key={t.id} className="rounded-lg border p-3">
            <div className="flex items-start justify-between">
              <div className="font-medium mr-2 break-words">{t.title}</div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="rounded-md" onClick={()=> onMove(t.id, -1)}>◀</Button>
                <Button variant="outline" size="sm" className="rounded-md" onClick={()=> onMove(t.id, 1)}>▶</Button>
                <Button variant="outline" size="sm" className="rounded-md text-red-600" onClick={()=> onRemove(t.id)}>✕</Button>
              </div>
            </div>
            {t.description ? <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{t.description}</div> : null}
            <div className="mt-2 flex items-center gap-2">
              {t.dueDate ? <Badge variant="secondary">Due {new Date(t.dueDate).toLocaleString()}</Badge> : null}
              {t.tags?.map(tag => (<Badge key={tag} variant="outline">{tag}</Badge>))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function TasksPage(){
  const { user } = useRole();
  const [items, setItems] = useState<Task[]>(() => getTasks(user.id));
  useEffect(()=>{ setItems(getTasks(user.id)); }, [user.id]);

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [desc, setDesc] = useState("");
  const [tagDraft, setTagDraft] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const byStatus = useMemo(()=> ({
    todo: items.filter(i=>i.status==="todo"),
    doing: items.filter(i=>i.status==="doing"),
    done: items.filter(i=>i.status==="done"),
  }), [items]);

  const save = (next: Task[]) => { setItems(next); setTasks(user.id, next); };

  const add = () => {
    if (!title.trim()) return;
    const t: Task = { id: crypto.randomUUID(), title: title.trim(), status: "todo", dueDate: dueDate || undefined, description: desc || undefined, tags: tags.length? tags: undefined };
    const next = [t, ...items];
    save(next);
    setTitle(""); setDueDate(""); setDesc(""); setTags([]); setTagDraft("");
    const remind = localStorage.getItem("compass:reminders") === "on";
    if (remind && t.dueDate && "Notification" in window && Notification.permission === "granted"){
      const when = new Date(t.dueDate).getTime() - Date.now();
      if (when > 0 && when < 60*60*1000) {
        setTimeout(()=> new Notification("Task due soon", { body: t.title }), Math.min(when, 30*1000));
      }
    }
  };

  const move = (id:string, dir:-1|1) => {
    const order = ["todo","doing","done"] as const;
    save(items.map(it => it.id!==id ? it : ({
      ...it,
      status: order[Math.max(0, Math.min(order.length-1, order.indexOf(it.status)+dir))]
    })));
  };
  const remove = (id:string) => save(items.filter(i=>i.id!==id));

  const enableReminders = async () => {
    if (!("Notification" in window)) return;
    const res = await Notification.requestPermission();
    if (res === "granted") localStorage.setItem("compass:reminders", "on");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tasks & Kanban</h1>
        <Button variant="outline" className="rounded-lg" onClick={enableReminders}><Bell className="h-4 w-4 mr-2"/>Enable reminders</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Create Task</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <Label>Title</Label>
            <Input value={title} onChange={e=> setTitle(e.target.value)} placeholder="e.g. Submit CS assignment" />
          </div>
          <div>
            <Label>Due</Label>
            <Input type="datetime-local" value={dueDate} onChange={e=> setDueDate(e.target.value)} />
          </div>
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input value={tagDraft} onChange={e=> setTagDraft(e.target.value)} placeholder="add tag" />
              <Button type="button" variant="outline" onClick={()=>{ if(tagDraft.trim()){ setTags(prev=>[...prev, tagDraft.trim()]); setTagDraft(""); } }}>Add</Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">{tags.map(t=> <Badge key={t} variant="secondary">{t}</Badge>)}</div>
          </div>
          <div className="md:col-span-4">
            <Label>Description</Label>
            <Textarea rows={3} value={desc} onChange={e=> setDesc(e.target.value)} placeholder="Details..." />
            <div className="mt-3"><Button onClick={add} className="rounded-lg"><Plus className="h-4 w-4 mr-2"/>Add Task</Button></div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        <TabsContent value="board" className="mt-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Column title="To Do" tasks={byStatus.todo} onMove={move} onRemove={remove} />
            <Column title="In Progress" tasks={byStatus.doing} onMove={move} onRemove={remove} />
            <Column title="Done" tasks={byStatus.done} onMove={move} onRemove={remove} />
          </div>
        </TabsContent>
        <TabsContent value="list" className="mt-4">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-3">Title</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Due</th>
                    <th className="p-3">Tags</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(i=> (
                    <tr key={i.id} className="border-b">
                      <td className="p-3 max-w-[420px] break-words">{i.title}</td>
                      <td className="p-3 capitalize">{i.status}</td>
                      <td className="p-3">{i.dueDate? new Date(i.dueDate).toLocaleString(): "—"}</td>
                      <td className="p-3">{i.tags?.map(t=> <Badge key={t} variant="outline" className="mr-1">{t}</Badge>)}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={()=> move(i.id, -1)}>◀</Button>
                          <Button variant="outline" size="sm" onClick={()=> move(i.id, 1)}>▶</Button>
                          <Button variant="outline" size="sm" className="text-red-600" onClick={()=> remove(i.id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
