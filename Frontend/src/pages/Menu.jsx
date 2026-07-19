import { useQuery } from "@tanstack/react-query";
import { Leaf, Wheat, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { api, assetUrl } from "../lib/api";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const labels = { V: "Vegetarian", VG: "Vegan", GF: "Gluten Free", DF: "Dairy Free", NF: "Nut Free", H: "Halal" };

const Menu = () => {
  const [category, setCategory] = useState("all");
  const { data, isLoading, error } = useQuery({ queryKey: ["menu"], queryFn: () => api("/api/menu?limit=100&sort=order,name") });
  const items = data?.data || [];
  const filtered = items.filter((item) => category === "all" || (category === "vegan" ? item.dietaryTags?.includes("VG") : item.category === category));
  const categories = [["all", "All"], ["starters", "Starters"], ["mains", "Mains"], ["desserts", "Desserts"], ["drinks", "Drinks"], ["vegan", "Vegan"]];

  return <div className="min-h-screen bg-background pt-24"><div className="container mx-auto px-6 py-12">
    <div className="text-center mb-12 animate-fade-in"><h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">Our Menu</h1><p className="text-lg text-muted-foreground max-w-2xl mx-auto">A curated selection of dishes crafted with the finest ingredients and utmost care</p></div>
    <div className="flex flex-col lg:flex-row gap-8"><aside className="lg:w-64"><div className="bg-card rounded-lg p-6 shadow-lg"><h2 className="text-lg font-montserrat font-semibold mb-4">CATEGORIES</h2><div className="space-y-2">{categories.map(([value, label]) => <button key={value} onClick={() => setCategory(value)} className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${category === value ? "bg-accent text-accent-foreground" : "hover:bg-secondary text-muted-foreground"}`}>{label}</button>)}</div></div></aside>
    <section className="flex-1">{isLoading ? <div className="py-24 flex justify-center"><LoaderCircle className="animate-spin text-accent" /></div> : error ? <p className="text-destructive">{error.message}</p> : filtered.length ? <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{filtered.map((item) => <Card key={item._id} className="card-elegant overflow-hidden group"><div className="image-overlay">{item.images?.[0]?.url ? <img src={assetUrl(item.images.find((image) => image.isMain)?.url || item.images[0].url)} alt={item.images?.[0]?.altText || item.name} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" /> : <div className="h-48 bg-secondary" />}</div><CardContent className="p-6"><div className="flex justify-between gap-4"><h3 className="text-xl font-montserrat font-semibold">{item.name}</h3><span className="text-xl font-montserrat font-bold text-gold">${Number(item.price).toFixed(2)}</span></div><p className="mt-2 text-muted-foreground">{item.description}</p>{item.dietaryTags?.length > 0 && <div className="flex flex-wrap gap-2 mt-4">{item.dietaryTags.map((tag) => <Badge key={tag} variant="secondary" className="gap-1">{tag === "GF" ? <Wheat size={12} /> : <Leaf size={12} />}{labels[tag] || tag}</Badge>)}</div>}</CardContent></Card>)}</div> : <p className="text-muted-foreground py-12">No dishes match this category yet.</p>}</section></div></div></div>;
};
export default Menu;
