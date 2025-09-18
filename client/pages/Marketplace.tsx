import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRole } from "@/context/role";
import { MarketItem, getMarket, setMarket } from "@/lib/store";

export default function MarketplacePage(){
  const { user } = useRole();
  const [items, setItems] = useState<MarketItem[]>(()=> getMarket());
  const [tab, setTab] = useState<'sale'|'lost'|'found'>('sale');
  const filtered = useMemo(()=> items.filter(i=> i.type===tab), [items, tab]);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const add = () => {
    if (!title.trim()) return;
    const it: MarketItem = {
      id: crypto.randomUUID(), type: tab, title: title.trim(), description: desc || undefined,
      price: price? Number(price): undefined, imageUrl: imageUrl || undefined, userId: user.id, date: new Date().toISOString()
    };
    const next = [it, ...getMarket()]; setMarket(next); setItems(next);
    setTitle(""); setPrice(""); setDesc(""); setImageUrl("");
  };
  const remove = (id:string) => { const next = getMarket().filter(i=> i.id!==id); setMarket(next); setItems(next); };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Campus Marketplace & Lost and Found</h1>
      <Tabs value={tab} onValueChange={(v)=> setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="sale">For Sale</TabsTrigger>
          <TabsTrigger value="lost">Lost</TabsTrigger>
          <TabsTrigger value="found">Found</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4">
          <Card>
            <CardHeader><CardTitle>New Post</CardTitle></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-4">
              <div className="md:col-span-2">
                <Label>Title</Label>
                <Input value={title} onChange={e=> setTitle(e.target.value)} placeholder={tab==='sale'? 'e.g. MA102 Textbook - like new' : 'Item title'} />
              </div>
              <div>
                <Label>{tab==='sale'? 'Price (optional)': 'Image URL'}</Label>
                {tab==='sale'? (
                  <Input value={price} onChange={e=> setPrice(e.target.value)} placeholder="e.g. 450" />
                ) : (
                  <Input value={imageUrl} onChange={e=> setImageUrl(e.target.value)} placeholder="https://..." />
                )}
              </div>
              <div className="md:col-span-4">
                <Label>Description</Label>
                <Textarea rows={3} value={desc} onChange={e=> setDesc(e.target.value)} placeholder="Details..." />
                <div className="mt-3"><Button onClick={add} className="rounded-lg">Post</Button></div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3 mt-6">
            {filtered.map(it => (
              <Card key={it.id}>
                <CardHeader><CardTitle className="text-base">{it.title}</CardTitle></CardHeader>
                <CardContent>
                  {it.imageUrl ? <img src={it.imageUrl} alt="" className="w-full h-36 object-cover rounded-md border" /> : null}
                  <div className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{it.description || '—'}</div>
                  <div className="mt-2 text-sm">{it.price? `₹${it.price}`: ''}</div>
                  <div className="mt-2 text-xs text-muted-foreground">Posted {new Date(it.date).toLocaleString()}</div>
                  <div className="mt-3"><Button variant="outline" size="sm" className="text-red-600" onClick={()=> remove(it.id)}>Remove</Button></div>
                </CardContent>
              </Card>
            ))}
            {filtered.length===0 ? <Card><CardContent className="p-6 text-sm text-muted-foreground">No posts yet.</CardContent></Card> : null}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
