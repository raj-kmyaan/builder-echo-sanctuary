import { Outlet, Link } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Bot, GraduationCap, LayoutDashboard, BookOpen, CreditCard, Map as MapIcon, ShoppingBag, Users, Briefcase, HelpCircle, Settings, LogOut, Users2, Moon, Sun, CalendarDays, CheckSquare, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoleProvider, useRole } from "@/context/role";
import { useMemo } from "react";

function Navbar() {
  const { user, setRole } = useRole();
  return (
    <div className="flex h-18 items-center justify-between gap-4 px-6 py-4 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-5" />
        <div className="relative w-[320px] max-w-[50vw]">
          <Input className="pl-9" placeholder="Search courses, students, resources..." />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-lg" onClick={() => {
          const root = document.documentElement;
          const isDark = root.classList.toggle('dark');
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }}>
          <Sun className="h-5 w-5 dark:hidden" />
          <Moon className="h-5 w-5 hidden dark:block" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-lg"><Bell className="h-5 w-5" /></Button>
        <Button variant="ghost" size="icon" className="rounded-lg"><Bot className="h-5 w-5" /></Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback>{user.name.slice(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold leading-5">{user.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Compass</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setRole("student")}>Switch to Student</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("faculty")}>Switch to Faculty</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("admin")}>Switch to Admin</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/settings"><Settings className="mr-2 h-4 w-4" /> Settings</Link></DropdownMenuItem>
            <DropdownMenuItem asChild className="text-red-600 focus:text-red-600"><Link to="/login"><LogOut className="mr-2 h-4 w-4" /> Logout</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function SidebarNav() {
  const { user } = useRole();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  const items = useMemo(() => {
    if (user.role === "faculty") {
      return [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/calendar", icon: CalendarDays, label: "Calendar" },
        { to: "/tasks", icon: CheckSquare, label: "Tasks" },
        { to: "/attendance", icon: BookOpen, label: "Attendance" },
        { to: "/classes", icon: BookOpen, label: "My Classes" },
        { to: "/students", icon: Users2, label: "Students" },
        { to: "/map", icon: MapIcon, label: "Campus Map" },
        { to: "/helpdesk", icon: HelpCircle, label: "Helpdesk" },
      ];
    }
    // student default
    return [
      { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/attendance", icon: BookOpen, label: "Attendance" },
      { to: "/timetable-wizard", icon: CalendarDays, label: "Timetable Wizard" },
      { to: "/placements", icon: Briefcase, label: "Placements" },
      { to: "/courses", icon: BookOpen, label: "My Courses" },
      { to: "/fees", icon: CreditCard, label: "Fees" },
      { to: "/map", icon: MapIcon, label: "Campus Map" },
      { to: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
      { to: "/mentorship", icon: Users, label: "Mentorship" },
      { to: "/portfolio", icon: Briefcase, label: "My Portfolio" },
      { to: "/helpdesk", icon: HelpCircle, label: "Helpdesk" },
    ];
  }, [user.role]);

  const footer = [
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="size-7 rounded-md bg-primary text-primary-foreground grid place-items-center shadow">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="font-semibold">Compass</span>
        </div>
        <SidebarInput placeholder="Quick search" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={pathname === item.to}>
                    <Link to={item.to} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          {footer.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton asChild isActive={pathname === item.to}>
                <Link to={item.to} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/login" className={cn("flex items-center gap-2 text-destructive hover:text-destructive")}> 
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function AppLayout() {
  if (typeof document !== 'undefined') {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') document.documentElement.classList.add('dark');
  }
  return (
    <RoleProvider>
      <SidebarProvider>
        <SidebarNav />
        <SidebarInset>
          <Navbar />
          <div className="p-8">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  );
}
