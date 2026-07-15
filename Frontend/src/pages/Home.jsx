import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Star, Utensils } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const Home = () => {
  const signatureDishes = [
    {
      name: "Seared Scallops",
      description: "Perfectly seared, delicately buttery, exquisite flavor",
      image:
        "https://images.unsplash.com/photo-1605759758891-430e7885631b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2VhcmVkJTIwU2NhbGxvcHN8ZW58MHx8MHx8fDA%3D",
      price: "$28.00",
    },
    {
      name: "Truffle Risotto",
      description: "Creamy, earthy, aromatic, rich, indulgent",
      image:
        "https://images.unsplash.com/photo-1729875749099-8629b504fbd3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8VHJ1ZmZsZSUyMFJpc290dG98ZW58MHx8MHx8fDA%3D",
      price: "$32.00",
    },
    {
      name: "Duck Confit",
      description: "Crispy skin, tender meat, savory, classic",
      image:
        "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTWpIV8ZW32AS4E9tXRH6tP5mxSzs3gS98MRXqOCUppxpqxQAqfVmzDdJUfkETCucH_x3LZ8nr7h_IF3csFD7RPd_D-_iIDXLn788G5jBkM",
      price: "$38.00",
    },
  ];

  const testimonials = [
    {
      name: "Emily R.",
      text: '"An unparalleled dining experience, truly a masterpiece!"',
      avatar: "👩🏻‍💼",
    },
    {
      name: "David L.",
      text: '"Every dish was a work of art, highly recommend."',
      avatar: "👨🏻‍💻",
    },
    {
      name: "Sarah K.",
      text: '"The ambiance and service were impeccable."',
      avatar: "👩🏻‍🎨",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1535850452425-140ee4a8dbae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlc3RhdXJhbnQlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D)",
          }}
        />
        <div className="hero-overlay absolute inset-0" />

        <div className="relative z-10 text-center text-ivory px-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-montserrat font-bold mb-6 tracking-tight">
            Where Art Meets Flavor
          </h1>
          <p className="text-xl md:text-2xl font-lato font-light mb-8 max-w-2xl mx-auto">
            Nexa Dining: Where culinary artistry meets sustainable sourcing,
            crafting an unforgettable journey for the senses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reservations">
              <Button className="btn-terracotta px-8 py-3 text-lg">
                Reserve a Table
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/menu">
              <Button
                variant="outline"
                className="px-8 py-3 text-lg border-ivory text-black hover:bg-ivory hover:text-charcoal"
              >
                Explore Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-8 text-foreground">
              Seasonal plates crafted with zero-waste ethos
            </h2>
            <p className="text-lg font-lato text-muted-foreground leading-relaxed">
              Our commitment to sustainability drives every decision we make,
              from sourcing the finest local ingredients to implementing
              innovative waste reduction techniques. Each dish tells a story of
              passion, tradition, and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Signature Dishes */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4 text-foreground">
              Signature Dishes
            </h2>
            <p className="text-lg font-lato text-muted-foreground">
              Culinary masterpieces that define our essence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {signatureDishes.map((dish, index) => (
              <Card
                key={dish.name}
                className="card-elegant hover-lift group cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="image-overlay rounded-t-lg overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-montserrat font-semibold mb-2 text-foreground group-hover:text-accent transition-colors">
                    {dish.name}
                  </h3>
                  <p className="text-muted-foreground font-lato mb-4">
                    {dish.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-montserrat font-bold text-gold">
                      {dish.price}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="fill-gold text-gold"
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4 text-foreground">
              What Our Guests Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.name}
                className="card-elegant text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{testimonial.avatar}</div>
                  <p className="text-lg font-lato italic text-muted-foreground mb-4">
                    {testimonial.text}
                  </p>
                  <p className="font-montserrat font-semibold text-foreground">
                    — {testimonial.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="py-16 bg-sage text-ivory">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-ivory" size={24} />
                <span className="text-sm font-lato uppercase tracking-wider">
                  Upcoming Events
                </span>
              </div>
              <h3 className="text-2xl font-montserrat font-bold">
                Special Cuisine Tasting Experience - December 15
              </h3>
              <p className="font-lato text-ivory/80">
                Join us for an exclusive evening of culinary pairings
              </p>
            </div>
            <Link to="/gallery">
              <Button className="bg-ivory text-sage hover:bg-ivory/90 px-6 py-2">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
