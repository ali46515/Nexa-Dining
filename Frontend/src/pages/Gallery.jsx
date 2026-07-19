import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { api, assetUrl } from "../lib/api";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const Gallery = () => {
  const [tab, setTab] = useState("gallery"); const [filter, setFilter] = useState("all");
  const gallery = useQuery({ queryKey: ["gallery"], queryFn: () => api("/api/gallery?limit=100&sort=order,-createdAt") });
  const events = useQuery({ queryKey: ["events"], queryFn: () => api("/api/events?limit=100&sort=date") });
  const items = (gallery.data?.data || []).filter((item) => filter === "all" || item.category === filter);
  const filters = [["all", "All"], ["food", "Food"], ["ambiance", "Ambiance"], ["behind-the-scenes", "Behind-the-Scenes"], ["events", "Events"]];
  const loading = tab === "gallery" ? gallery.isLoading : events.isLoading; const error = tab === "gallery" ? gallery.error : events.error;
  return <div className="min-h-screen bg-background pt-24"><div className="container mx-auto px-6 py-12"><div className="flex justify-center mb-12 border-b border-border"><button onClick={() => setTab("gallery")} className={`px-8 py-4 font-montserrat ${tab === "gallery" ? "text-accent border-b-2 border-accent" : "text-muted-foreground"}`}>Gallery</button><button onClick={() => setTab("events")} className={`px-8 py-4 font-montserrat ${tab === "events" ? "text-accent border-b-2 border-accent" : "text-muted-foreground"}`}>Events</button></div>
  {loading ? <div className="py-24 flex justify-center"><LoaderCircle className="animate-spin text-accent" /></div> : error ? <p className="text-destructive">{error.message}</p> : tab === "gallery" ? <><div className="flex justify-center gap-3 mb-12 flex-wrap">{filters.map(([value, label]) => <button key={value} onClick={() => setFilter(value)} className={`px-5 py-2 rounded-full text-sm ${filter === value ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>{label}</button>)}</div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{items.map((item) => <Card key={item._id} className="card-elegant overflow-hidden"><div className="image-overlay">{item.image?.url ? <img src={assetUrl(item.image.url)} alt={item.image.altText || item.title} className="h-64 w-full object-cover" /> : <div className="h-64 bg-secondary" />}</div><CardContent className="p-6"><h2 className="text-lg font-montserrat font-semibold">{item.title}</h2><p className="mt-2 text-sm text-muted-foreground">{item.description}</p></CardContent></Card>)}</div></> : <div className="max-w-4xl mx-auto space-y-6">{(events.data?.data || []).map((event) => <Card key={event._id} className="card-elegant"><CardContent className="p-6 flex gap-5"><div className="w-16 h-16 shrink-0 bg-accent rounded-lg text-accent-foreground flex flex-col items-center justify-center"><span className="text-xs">{new Date(event.date).toLocaleString("en-US", { month: "short" })}</span><strong>{new Date(event.date).getDate()}</strong></div><div><div className="flex items-center gap-3"><h2 className="text-xl font-montserrat font-semibold">{event.title}</h2><Badge>{event.status}</Badge></div><p className="mt-2 text-muted-foreground">{event.description}</p><p className="mt-2 text-sm text-gold">{event.time} · ${Number(event.price).toFixed(2)}</p></div></CardContent></Card>)}</div>}</div></div>;
};
export default Gallery;
