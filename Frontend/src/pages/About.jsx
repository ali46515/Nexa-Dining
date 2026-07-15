import { Users, Leaf, Award, Heart } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

const About = () => {
  const milestones = [
    {
      year: "2010",
      title: "Humble Beginnings",
      description:
        "One chef with a small, dedicated team and a vision for exceptional dining.",
    },
    {
      year: "2015",
      title: "Embracing Sustainability",
      description:
        "Launched our first zero-waste initiative, partnering with local organic farms.",
    },
    {
      year: "2020",
      title: "Zero-Waste Commitment",
      description:
        "Implemented comprehensive composting and recycling programs, eliminating our environmental footprint.",
    },
    {
      year: "Today",
      title: "A Culinary Landmark",
      description:
        "Recognized as a leader in sustainable gastronomy, continually innovating and inspiring.",
    },
  ];

  const sustainabilityStats = [
    {
      icon: <Leaf className="text-sage" size={40} />,
      title: "Local Farms Partnership",
      stat: "95%",
      description: "LOCALLY SOURCED INGREDIENTS",
    },
    {
      icon: <Users className="text-terracotta" size={40} />,
      title: "Zero Plastic Policy",
      stat: "5,000+",
      description: "LBS FOOD WASTE DIVERTED",
    },
    {
      icon: <Award className="text-gold" size={40} />,
      title: "Compost Program",
      stat: "100%",
      description: "RENEWABLE ENERGY",
    },
    {
      icon: <Heart className="text-accent" size={40} />,
      title: "Water Conservation",
      stat: "3x",
      description: "COMMUNITY IMPACT MULTIPLIER",
    },
  ];

  const teamMembers = [
    {
      name: "Chef John Doe",
      role: "Head Chef",
      bio: "Culinary artist with 15 years of experience in fine dining",
      image: "👨🏻‍🍳",
    },
    {
      name: "Jane Smith",
      role: "Restaurant Manager",
      bio: "Hospitality expert ensuring every guest feels at home",
      image: "👩🏻‍💼",
    },
    {
      name: "David Lee",
      role: "Sous Chef",
      bio: "Passionate about sustainable cooking and local ingredients",
      image: "👨🏻‍🍳",
    },
    {
      name: "Sarah Chen",
      role: "Pastry Chef",
      bio: "Award-winning pastry artist creating sweet masterpieces",
      image: "👩🏻‍🍳",
    },
    {
      name: "Michael Brown",
      role: "Head Sommelier",
      bio: "Wine expert with extensive knowledge of organic vineyards",
      image: "🍷",
    },
    {
      name: "Emily White",
      role: "Events Coordinator",
      bio: "Creating unforgettable experiences for special occasions",
      image: "👩🏻‍💻",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 text-foreground">
              Our Story
            </h1>
            <h2 className="text-2xl md:text-3xl font-montserrat font-medium mb-8 text-accent">
              From Farm to Fork: A Culinary Journey
            </h2>
            <p className="text-lg font-lato text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Nexa Dining was founded on a simple yet profound philosophy: to
              establish the beauty of nature and the artistry of culinary
              craftsmanship. Our journey began with a commitment to sourcing the
              finest, freshest ingredients directly from local farms and
              sustainable producers. Every dish tells a story of passion,
              tradition, and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Story Timeline */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.year}
                    className="flex gap-4 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-sm font-montserrat font-bold text-accent-foreground">
                          {milestone.year}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-montserrat font-semibold mb-2 text-foreground">
                        {milestone.title}
                      </h3>
                      <p className="font-lato text-muted-foreground">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hlZnxlbnwwfHwwfHx8MA%3D%3D"
                  alt="Chef at work"
                  className="w-full h-auto rounded-lg shadow-lg animate-scale-in"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Commitment */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4 text-foreground">
              Our Commitment to Sustainability
            </h2>
            <p className="text-lg font-lato text-muted-foreground max-w-2xl mx-auto">
              We believe that exceptional cuisine and environmental
              responsibility go hand in hand
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sustainabilityStats.map((stat, index) => (
              <Card
                key={stat.title}
                className="card-elegant text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">{stat.icon}</div>
                  <div className="text-3xl font-montserrat font-bold text-accent mb-2">
                    {stat.stat}
                  </div>
                  <div className="text-xs font-lato uppercase tracking-wider text-muted-foreground mb-2">
                    {stat.description}
                  </div>
                  <h3 className="text-sm font-montserrat font-semibold text-foreground">
                    {stat.title}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4 text-foreground">
              Meet Our Team
            </h2>
            <p className="text-lg font-lato text-muted-foreground">
              The passionate individuals who bring our vision to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={member.name}
                className="card-elegant hover-lift text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-montserrat font-semibold mb-1 text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-sm font-lato text-accent uppercase tracking-wider mb-4">
                    {member.role}
                  </p>
                  <p className="text-sm font-lato text-muted-foreground">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
