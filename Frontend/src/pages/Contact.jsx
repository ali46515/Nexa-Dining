import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";

const Contact = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqItems = [
    {
      question: "Do you accommodate large groups?",
      answer:
        "Yes, we welcome large groups and private dining. Please contact us in advance for groups of 8 or more to ensure the best experience.",
    },
    {
      question: "What are your dietary accommodation options?",
      answer:
        "We offer extensive options for various dietary needs including vegan, vegetarian, gluten-free, and allergen-free dishes. Please inform us of any restrictions when making your reservation.",
    },
    {
      question: "Do you offer cooking classes or culinary events?",
      answer:
        "Yes, we regularly host cooking classes, wine tastings, and special culinary events. Check our Events page for upcoming opportunities.",
    },
    {
      question: "What is your cancellation policy?",
      answer:
        "We require 24-hour notice for cancellations. For large groups or special events, we may require 48-72 hours notice.",
    },
    {
      question: "Do you have a dress code?",
      answer:
        "We encourage smart casual to formal attire. While we don't have a strict dress code, we recommend dressing appropriately for our upscale dining atmosphere.",
    },
  ];

  const operatingHours = [
    { day: "Monday - Thursday", hours: "5:00 PM - 10:00 PM" },
    { day: "Friday - Saturday", hours: "5:00 PM - 11:00 PM" },
    { day: "Sunday", hours: "4:00 PM - 9:00 PM" },
  ];

  const isOpen = () => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    if (day === 0) return hour >= 16 && hour < 21; // Sunday
    if (day >= 1 && day <= 4) return hour >= 17 && hour < 22; // Mon-Thu
    if (day >= 5 && day <= 6) return hour >= 17 && hour < 23; // Fri-Sat

    return false;
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="animate-fade-in">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="text-2xl font-montserrat font-bold text-foreground">
                  Get in Touch
                </CardTitle>
                <p className="text-muted-foreground font-lato">
                  We'd love to hear from you. Send us a message and we'll
                  respond as soon as possible.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-montserrat font-medium text-foreground"
                    >
                      First Name
                    </Label>
                    <Input id="firstName" placeholder="John" className="mt-1" />
                  </div>
                  <div>
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-montserrat font-medium text-foreground"
                    >
                      Last Name
                    </Label>
                    <Input id="lastName" placeholder="Doe" className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-montserrat font-medium text-foreground"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="subject"
                    className="text-sm font-montserrat font-medium text-foreground"
                  >
                    Subject
                  </Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reservation">
                        Reservation Inquiry
                      </SelectItem>
                      <SelectItem value="event">Private Event</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="general">General Question</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="message"
                    className="text-sm font-montserrat font-medium text-foreground"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    className="mt-1"
                    rows={5}
                  />
                </div>

                <Button className="btn-terracotta w-full py-3 text-lg">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & Details */}
          <div className="space-y-8 animate-slide-up">
            {/* Operating Hours */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="text-xl font-montserrat font-bold text-foreground flex items-center gap-2">
                  <Clock className="text-accent" size={20} />
                  Operating Hours
                  {isOpen() && (
                    <Badge className="bg-sage text-white ml-2">Open Now</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {operatingHours.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="font-lato text-foreground">
                      {schedule.day}
                    </span>
                    <span className="font-lato text-muted-foreground">
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="text-xl font-montserrat font-bold text-foreground">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-accent flex-shrink-0" />
                  <div>
                    <p className="font-lato text-foreground">
                      info@nexadining.com
                    </p>
                    <p className="text-sm font-lato text-muted-foreground">
                      General inquiries
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-accent flex-shrink-0" />
                  <div>
                    <p className="font-lato text-foreground">
                      +1 (123) 456-7890
                    </p>
                    <p className="text-sm font-lato text-muted-foreground">
                      Reservations & inquiries
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-accent flex-shrink-0" />
                  <div>
                    <p className="font-lato text-foreground">
                      123 Culinary Lane
                    </p>
                    <p className="font-lato text-foreground">
                      Metropolis, NY 10001
                    </p>
                    <p className="text-sm font-lato text-muted-foreground">
                      Valet parking available
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Instagram size={20} className="text-accent" />
                  <p className="font-lato text-foreground">@nexadining</p>
                </div>
              </CardContent>
            </Card>

            {/* Instagram Feed Preview */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="text-xl font-montserrat font-bold text-foreground">
                  Follow Our Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-muted rounded-lg flex items-center justify-center"
                    >
                      <Instagram size={24} className="text-muted-foreground" />
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  View More on Instagram
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 animate-slide-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4 text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-lg font-lato text-muted-foreground">
              Find answers to common questions about dining with us
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="card-elegant">
                <CardContent className="p-0">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-secondary/50 transition-colors"
                  >
                    <h3 className="font-montserrat font-semibold text-foreground">
                      {item.question}
                    </h3>
                    {openFaq === index ? (
                      <ChevronUp size={20} className="text-accent" />
                    ) : (
                      <ChevronDown size={20} className="text-accent" />
                    )}
                  </button>

                  {openFaq === index && (
                    <div className="px-6 pb-6 animate-fade-in">
                      <p className="font-lato text-muted-foreground">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
