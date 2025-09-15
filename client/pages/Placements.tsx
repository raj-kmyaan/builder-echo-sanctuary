import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const JOBS = [
  { id: "1", company: "TechNova", title: "Frontend Intern", location: "Remote", type: "Internship", match: 85, logo: "https://dummyimage.com/40x40/2563eb/ffffff&text=T" },
  { id: "2", company: "DataForge", title: "Data Analyst", location: "New York, NY", type: "Full-Time", match: 78, logo: "https://dummyimage.com/40x40/16a34a/ffffff&text=D" },
  { id: "3", company: "CloudCore", title: "SRE Intern", location: "Remote", type: "Internship", match: 66, logo: "https://dummyimage.com/40x40/f59e0b/ffffff&text=C" },
];

const APPLICATIONS = [
  { id: "a1", company: "TechNova", title: "Frontend Intern", date: "2025-09-10", status: "Under Review" },
  { id: "a2", company: "DataForge", title: "Data Analyst", date: "2025-09-12", status: "Interviewing" },
];

function Ring({ value }:{ value:number }){
  const radius = 20; const stroke=6; const c = 2*Math.PI*radius; const o = c*(1-value/100);
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r={radius} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
      <circle cx="24" cy="24" r={radius} stroke="hsl(var(--primary))" strokeWidth={stroke} fill="none" strokeDasharray={c} strokeDashoffset={o} strokeLinecap="round" transform="rotate(-90 24 24)" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fontWeight="600">{value}%</text>
    </svg>
  );
}

export default function PlacementsPage(){
  const [active, setActive] = useState<string | null>(null);
  const selected = useMemo(()=> JOBS.find(j=>j.id===active) || null, [active]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Internship & Placements Portal</h1>
      <Tabs defaultValue="openings">
        <TabsList>
          <TabsTrigger value="openings">Job Openings</TabsTrigger>
          <TabsTrigger value="apps">My Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="openings" className="mt-4">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6 space-y-3 max-h-[70vh] overflow-auto pr-1">
              {JOBS.map(j => (
                <Card key={j.id} onClick={()=> setActive(j.id)} className="cursor-pointer hover:shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <img src={j.logo} className="h-10 w-10 rounded" alt="" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold truncate">{j.company}</div>
                      <div className="truncate">{j.title}</div>
                      <div className="text-xs text-muted-foreground">{j.location}</div>
                      <Badge className="mt-1" variant="secondary">{j.type}</Badge>
                    </div>
                    <div className="shrink-0 text-center">
                      <Ring value={j.match} />
                      <div className="text-xs mt-1">Match</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="col-span-12 lg:col-span-6">
              {!selected ? (
                <Card><CardContent className="p-6 text-muted-foreground">Select a job to view details.</CardContent></Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>{selected.title} @ {selected.company}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Badge variant="secondary">{selected.type}</Badge>
                    <div className="text-sm text-muted-foreground">Location: {selected.location}</div>
                    <div>
                      <h3 className="font-medium">Description</h3>
                      <p className="text-sm text-muted-foreground">Work with a modern stack, collaborate with cross-functional teams, and ship features at scale.</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Requirements</h3>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        <li>Strong fundamentals in CS</li>
                        <li>Experience with React and TypeScript</li>
                        <li>Good communication</li>
                      </ul>
                    </div>
                    <Button size="lg" className="rounded-lg">Apply Using My Portfolio</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="apps" className="mt-4">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-3">Company</th>
                    <th className="p-3">Job Title</th>
                    <th className="p-3">Date Applied</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {APPLICATIONS.map(a => (
                    <tr key={a.id} className="border-b">
                      <td className="p-3">{a.company}</td>
                      <td className="p-3">{a.title}</td>
                      <td className="p-3">{a.date}</td>
                      <td className="p-3"><span className={a.status==="Interviewing"?"bg-green-100 text-green-700":"bg-amber-100 text-amber-700" + " px-2 py-0.5 rounded text-xs"}>{a.status}</span></td>
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
