import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, getTickets, setTickets } from "@/lib/store";

export default function AdminTicketsPage(){
  const [list, setList] = useState<Ticket[]>(()=> getTickets());
  const updateStatus = (id:string, status: Ticket['status']) => { const next = list.map(t=> t.id!==id? t: { ...t, status }); setTickets(next); setList(next); };
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Support Ticket Oversight</h1>
      <Card>
        <CardHeader><CardTitle>All Tickets</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(t=> (
                <tr key={t.id} className="border-b">
                  <td className="p-3">{t.id.slice(0,8)}</td>
                  <td className="p-3">{t.subject}</td>
                  <td className="p-3">{t.category}</td>
                  <td className="p-3 capitalize">{t.status.replace('_',' ')}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={()=> updateStatus(t.id, 'in_progress')}>Start</Button>
                      <Button size="sm" variant="outline" onClick={()=> updateStatus(t.id, 'resolved')}>Resolve</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length===0 ? <tr><td className="p-3 text-muted-foreground" colSpan={5}>No tickets.</td></tr> : null}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
