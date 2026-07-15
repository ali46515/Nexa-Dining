import { useState } from "react";
import { Download, Leaf, Wheat } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Starters",
    "Mains",
    "Desserts",
    "Drinks",
    "Vegan",
  ];

  const menuItems = [
    {
      name: "Seared Scallops",
      description: "Perfectly seared, delicately buttery, exquisite flavor",
      price: "$28.00",
      category: "Starters",
      image:
        "https://images.unsplash.com/photo-1605759758891-430e7885631b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2VhcmVkJTIwU2NhbGxvcHN8ZW58MHx8MHx8fDA%3D",
      dietary: ["GF"],
    },
    {
      name: "Truffle Risotto",
      description: "Creamy, earthy, aromatic, rich, indulgent",
      price: "$32.00",
      category: "Mains",
      image:
        "https://images.unsplash.com/photo-1729875749099-8629b504fbd3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8VHJ1ZmZsZSUyMFJpc290dG98ZW58MHx8MHx8fDA%3D",
      dietary: ["V"],
    },
    {
      name: "Duck Confit",
      description: "Crispy skin, tender meat, savory, classic",
      price: "$38.00",
      category: "Mains",
      image:
        "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTWpIV8ZW32AS4E9tXRH6tP5mxSzs3gS98MRXqOCUppxpqxQAqfVmzDdJUfkETCucH_x3LZ8nr7h_IF3csFD7RPd_D-_iIDXLn788G5jBkM",
      dietary: [],
    },
    {
      name: "Artisanal Pasta",
      description: "Hand-crafted pasta with seasonal vegetables",
      price: "$26.00",
      category: "Mains",
      image:
        "https://images.unsplash.com/photo-1729875749099-8629b504fbd3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8VHJ1ZmZsZSUyMFJpc290dG98ZW58MHx8MHx8fDA%3D",
      dietary: ["V"],
    },
    {
      name: "Pan-Seared Salmon",
      description: "Flaky salmon with lemon-dill sauce",
      price: "$30.00",
      category: "Mains",
      image:
        "https://images.unsplash.com/photo-1605759758891-430e7885631b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2VhcmVkJTIwU2NhbGxvcHN8ZW58MHx8MHx8fDA%3D",
      dietary: ["GF"],
    },
    {
      name: "Chocolate Lava Cake",
      description: "Rich, molten chocolate with vanilla ice cream",
      price: "$14.00",
      category: "Desserts",
      image:
        "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTWpIV8ZW32AS4E9tXRH6tP5mxSzs3gS98MRXqOCUppxpqxQAqfVmzDdJUfkETCucH_x3LZ8nr7h_IF3csFD7RPd_D-_iIDXLn788G5jBkM",
      dietary: [],
    },
  ];

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) =>
          selectedCategory === "Vegan"
            ? item.dietary.includes("V")
            : item.category === selectedCategory
        );

  const getDietaryIcon = (tag) => {
    switch (tag) {
      case "V":
        return <Leaf size={12} className="text-sage" />;
      case "GF":
        return <Wheat size={12} className="text-gold" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-4 text-foreground">
            Our Menu
          </h1>
          <p className="text-lg font-lato text-muted-foreground max-w-2xl mx-auto">
            A curated selection of dishes crafted with the finest ingredients
            and utmost care
          </p>
          <Button className="mt-6 bg-charcoal text-ivory hover:bg-charcoal/90">
            <Download size={16} className="mr-2" />
            Download PDF
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          <div className="lg:w-64 animate-slide-up">
            <div className="bg-card rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-montserrat font-semibold mb-4 text-foreground">
                CATEGORIES
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-lato transition-colors ${
                      selectedCategory === category
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item, index) => (
                <Card
                  key={item.name}
                  className="card-elegant hover-lift group cursor-pointer animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="image-overlay rounded-t-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-montserrat font-semibold text-foreground group-hover:text-accent transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-xl font-montserrat font-bold text-gold">
                        {item.price}
                      </span>
                    </div>

                    <p className="text-muted-foreground font-lato mb-4">
                      {item.description}
                    </p>

                    {item.dietary.length > 0 && (
                      <div className="flex gap-2">
                        {item.dietary.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs flex items-center gap-1"
                          >
                            {getDietaryIcon(tag)}
                            {tag === "V"
                              ? "Vegan"
                              : tag === "GF"
                              ? "Gluten Free"
                              : tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
