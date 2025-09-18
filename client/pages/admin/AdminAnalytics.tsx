import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { getAttendance, getBroadcasts, getMarket, getTickets } from "@/lib/store";

export default function AdminAnalyticsPage(){
  const attendanceScopes = ["Computer Science::Second::Sem 3","Computer Science::First::Sem 1"];
  const att = attendanceScopes.flatMap(s=> getAttendance(s).map(r=> ({ scope: s, date: r.date, present: r.rows.filter(x=> x.present).length, total: r.rows.length })));
  const aggByDate = Object.values(att.reduce((acc:any, r)=>{ const k=r.date; acc[k] = acc[k]||{ date:k, present:0, total:0 }; acc[k].present+=r.present; acc[k].total+=r.total; return acc; }, {}));

  const tickets = getTickets();
  const ticketAgg = Object.values(tickets.reduce((acc:any, t)=>{ const k=t.category; acc[k]=acc[k]||{ category:k, count:0 }; acc[k].count++; return acc; }, {}));

  const market = getMarket();
  const marketAgg = Object.values(market.reduce((acc:any, m)=>{ const k=m.type; acc[k]=acc[k]||{ type:k, count:0 }; acc[k].count++; return acc; }, {}));

  const broadcasts = getBroadcasts();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">College-Wide Analytics</h1>
      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader><CardTitle>Attendance Overview</CardTitle></CardHeader>
          <CardContent>
            {aggByDate.length===0? <div className="text-sm text-muted-foreground">No attendance data yet.</div> : (
              <AreaChart width={600} height={260} data={aggByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area dataKey="present" stroke="#22c55e" fill="#22c55e30" name="Present" />
                <Area dataKey="total" stroke="#60a5fa" fill="#60a5fa30" name="Total" />
              </AreaChart>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-5">
          <CardHeader><CardTitle>Support Tickets by Category</CardTitle></CardHeader>
          <CardContent>
            {ticketAgg.length===0 ? <div className="text-sm text-muted-foreground">No tickets yet.</div> : (
              <BarChart width={420} height={260} data={ticketAgg}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-6">
          <CardHeader><CardTitle>Marketplace Activity</CardTitle></CardHeader>
          <CardContent>
            {marketAgg.length===0? <div className="text-sm text-muted-foreground">No posts yet.</div> : (
              <BarChart width={520} height={260} data={marketAgg}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-6">
          <CardHeader><CardTitle>Announcements (Recent)</CardTitle></CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              {broadcasts.slice(0,6).map(b=> <li key={b.id}><span className="font-medium">{b.title}:</span> {b.body}</li>)}
              {broadcasts.length===0? <li className="text-muted-foreground">No announcements.</li> : null}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
