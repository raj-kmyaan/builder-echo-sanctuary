import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Github, Linkedin, Link as LinkIcon, Award, CalendarCheck, PiggyBank } from "lucide-react";
import { useParams } from "react-router-dom";

function LinkIconButton({ href, children }:{ href?: string; children: React.ReactNode }){
  const active = !!href;
  const className = active ? "text-foreground" : "text-muted-foreground opacity-60";
  return active ? (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent">
      {children}
    </a>
  ) : (
    <button className={`inline-flex h-9 w-9 items-center justify-center rounded-md border bg-muted ${className}`} disabled>
      {children}
    </button>
  );
}

export default function ProfilePage(){
  const { id } = useParams();
  const storageKey = `compass:profile:${id || "me"}`;
  const [name] = useState("Alex Johnson");
  const [links, setLinks] = useState<{ linkedin?: string; github?: string; website?: string }>({});
  const [draft, setDraft] = useState(links);

  useEffect(()=>{
    const raw = localStorage.getItem(storageKey);
    if (raw) setLinks(JSON.parse(raw));
  }, [storageKey]);

  useEffect(()=>{ setDraft(links); }, [links]);

  const save = () => { localStorage.setItem(storageKey, JSON.stringify(draft)); setLinks(draft); };

  const achievements = [
    { key: "attendance", name: "Perfect Attendance", icon: CalendarCheck, desc: "Achieved 95%+ attendance in the Fall semester" },
    { key: "early", name: "Early Bird", icon: PiggyBank, desc: "Submitted all assignments before deadlines" },
    { key: "mentor", name: "Peer Mentor", icon: Award, desc: "Helped 5+ peers via mentorship" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 flex items-center gap-6">
          <img src="/placeholder.svg" className="h-20 w-20 rounded-full" />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">{name}</h1>
            <div className="text-sm text-muted-foreground">Enrollment: IP-2025-001 • Computer Science</div>
            <div className="mt-3 flex items-center gap-2">
              <LinkIconButton href={links.linkedin}><Linkedin className="h-4 w-4" /></LinkIconButton>
              <LinkIconButton href={links.github}><Github className="h-4 w-4" /></LinkIconButton>
              <LinkIconButton href={links.website}><LinkIcon className="h-4 w-4" /></LinkIconButton>
              <Dialog>
                <DialogTrigger asChild><Button variant="outline" className="ml-2 rounded-lg">Edit Profile</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Edit Professional Links</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm">LinkedIn Profile URL</label>
                      <Input placeholder="https://linkedin.com/in/" value={draft.linkedin || ""} onChange={(e)=> setDraft({ ...draft, linkedin: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm">GitHub Profile URL</label>
                      <Input placeholder="https://github.com/" value={draft.github || ""} onChange={(e)=> setDraft({ ...draft, github: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm">Personal Website URL</label>
                      <Input placeholder="https://" value={draft.website || ""} onChange={(e)=> setDraft({ ...draft, website: e.target.value })} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={save} className="rounded-lg">Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses & Grades</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <Card><CardContent className="p-6 text-muted-foreground">Key stats coming soon.</CardContent></Card>
        </TabsContent>
        <TabsContent value="courses" className="mt-4">
          <Card><CardContent className="p-6 text-muted-foreground">Courses table to be added.</CardContent></Card>
        </TabsContent>
        <TabsContent value="portfolio" className="mt-4">
          <Card><CardContent className="p-6 text-muted-foreground">Projects gallery to be added.</CardContent></Card>
        </TabsContent>
        <TabsContent value="achievements" className="mt-4">
          <Card>
            <CardHeader><CardTitle>College Journey Achievements</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {achievements.map((a)=> (
                  <TooltipProvider key={a.key}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-center">
                          <div className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border">
                            <a.icon className="h-7 w-7 text-white drop-shadow" />
                          </div>
                          <div className="mt-2 text-sm font-medium">{a.name}</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>{a.desc}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
