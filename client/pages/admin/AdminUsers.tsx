import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUsers, setUsers, UserLite } from "@/lib/store";

export default function AdminUsersPage(){
  const [list, setList] = useState<UserLite[]>(()=> getUsers());
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserLite['role']>("student");

  const add = () => {
    if (!name.trim()) return;
    const next = [{ id: crypto.randomUUID(), name: name.trim(), role }, ...list];
    setUsers(next); setList(next); setName("");
  };
  const updateRole = (id:string, role: UserLite['role']) => { const next = list.map(u=> u.id!==id? u: { ...u, role }); setUsers(next); setList(next); };
  const remove = (id:string) => { const next = list.filter(u=> u.id!==id); setUsers(next); setList(next); };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">User Management</h1>
      <Card>
        <CardHeader><CardTitle>Create User</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <Label>Name</Label>
            <Input value={name} onChange={e=> setName(e.target.value)} placeholder="Full name" />
          </div>
          <div>
            <Label>Role</Label>
            <Input value={role} onChange={e=> setRole(e.target.value as any)} placeholder="student/faculty/admin/alumni" />
          </div>
          <div className="md:col-span-4"><Button onClick={add} className="rounded-lg">Add</Button></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(u=> (
                <tr key={u.id} className="border-b">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={()=> updateRole(u.id, 'student')}>Student</Button>
                      <Button size="sm" variant="outline" onClick={()=> updateRole(u.id, 'faculty')}>Faculty</Button>
                      <Button size="sm" variant="outline" onClick={()=> updateRole(u.id, 'admin')}>Admin</Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={()=> remove(u.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
