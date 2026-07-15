import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const Gallery = () => {
  const [activeTab, setActiveTab] = useState("Gallery");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = ["All", "Food", "Ambiance", "Behind-the-Scenes"];

  const galleryItems = [
    {
      title: "Braised Short Ribs",
      description: "Camera: Canon EOS R5 | Location: Kitchen",
      image:
        "https://images.unsplash.com/photo-1605759758891-430e7885631b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2VhcmVkJTIwU2NhbGxvcHN8ZW58MHx8MHx8fDA%3D",
      category: "Food",
    },
    {
      title: "Elegant Dining Room",
      description: "Camera: Sony Alpha 7 III | Location: Main Hall",
      image:
        "https://plus.unsplash.com/premium_photo-1683134354160-f7cab6070d90?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZWxlZ2FudCUyMGRpbmluZyUyMHJvb218ZW58MHx8MHx8fDA%3D",
      category: "Ambiance",
    },
    {
      title: "Chef's Precision",
      description: "Camera: Nikon Z7 II | Location: Prep Area",
      image:
        "https://images.unsplash.com/photo-1572715376701-98568319fd0b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hlZnxlbnwwfHwwfHx8MA%3D%3D",
      category: "Behind-the-Scenes",
    },
    {
      title: "Artisan Dessert Platter",
      description: "Camera: Canon EOS R5 | Location: Pastry Station",
      image:
        "https://images.unsplash.com/photo-1556537551-c2a8018c4eda?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEFydGlzYW4lMjBEZXNzZXJ0JTIwUGxhdHRlcnxlbnwwfHwwfHx8MA%3D%3D",
      category: "Food",
    },
    {
      title: "Cozy Bar Nook",
      description: "Camera: Sony Alpha 7 III | Location: Lounge",
      image:
        "https://media.istockphoto.com/id/1395504791/photo/3d-rendering-of-a-cafe-restaurant.webp?a=1&b=1&s=612x612&w=0&k=20&c=LROt0dLQ1QPJ1X6XLyGv3BjVsiTNEJL6uK6zMODBk40=",
      category: "Ambiance",
    },
    {
      title: "Fresh Ingredient Prep",
      description: "Camera: Nikon Z7 II | Location: Pantry",
      image:
        "https://media.istockphoto.com/id/2163829023/photo/male-cook-slicing-bell-pepper.webp?a=1&b=1&s=612x612&w=0&k=20&c=DSbU0xd8wv3cpyiC9w84LUV2KeKOp8DcqQZsASXHuaw=",
      category: "Behind-the-Scenes",
    },
  ];

  const events = [
    {
      date: "Dec 15",
      title: "Special Cuisine Tasting Experience",
      description:
        "An exclusive evening of culinary pairings with our sommelier",
      status: "upcoming",
    },
    {
      date: "Dec 22",
      title: "Holiday Feast",
      description: "Celebrate the season with our special holiday menu",
      status: "upcoming",
    },
    {
      date: "Jan 5",
      title: "New Year Brunch",
      description: "Start the year with our signature brunch experience",
      status: "upcoming",
    },
    {
      date: "Nov 18",
      title: "Harvest Dinner",
      description: "A celebration of autumn flavors and local produce",
      status: "past",
    },
  ];

  const filteredGallery =
    selectedFilter === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedFilter);

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-6 py-12">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex border-b border-border">
            {["Gallery", "Events"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-montserrat font-medium transition-colors relative ${
                  activeTab === tab
                    ? "text-accent border-b-2 border-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "Gallery" && (
          <div className="animate-fade-in">
            {/* Filter Buttons */}
            <div className="flex justify-center gap-4 mb-12 flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-6 py-2 rounded-full font-lato text-sm transition-colors ${
                    selectedFilter === filter
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-accent/20"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGallery.map((item, index) => (
                <Card
                  key={item.title}
                  className="card-elegant hover-lift group cursor-pointer animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="image-overlay rounded-t-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-montserrat font-semibold mb-2 text-foreground group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm font-lato text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Events" && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4 text-foreground">
                Events Calendar
              </h2>
              <p className="text-lg font-lato text-muted-foreground">
                Join us for exclusive culinary experiences and special occasions
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {events.map((event, index) => (
                <Card
                  key={event.title}
                  className={`card-elegant hover-lift animate-slide-up ${
                    event.status === "past" ? "opacity-60" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-accent rounded-lg flex flex-col items-center justify-center text-accent-foreground">
                          <span className="text-xs font-lato uppercase">
                            {event.date.split(" ")[0]}
                          </span>
                          <span className="text-lg font-montserrat font-bold">
                            {event.date.split(" ")[1]}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-montserrat font-semibold text-foreground">
                            {event.title}
                          </h3>
                          <Badge
                            variant={
                              event.status === "upcoming"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground font-lato">
                          {event.description}
                        </p>
                      </div>

                      {event.status === "upcoming" && (
                        <button className="btn-terracotta px-6 py-2 text-sm">
                          RSVP
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
