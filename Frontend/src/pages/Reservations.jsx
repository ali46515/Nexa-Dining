import { useState } from "react";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";

const Reservations = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [guests, setGuests] = useState("2");

  const timeSlots = [
    { time: "17:00", available: true },
    { time: "17:30", available: true },
    { time: "18:00", available: false },
    { time: "18:30", available: true },
    { time: "19:00", available: true },
    { time: "19:30", available: false },
    { time: "20:00", available: true },
    { time: "20:30", available: true },
    { time: "21:00", available: true },
  ];

  const generateCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    const today = new Date();
    return date.getMonth() === today.getMonth();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Reservation Form */}
          <div className="animate-fade-in">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="text-2xl font-montserrat font-bold text-foreground">
                  Make a Reservation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Calendar */}
                <div>
                  <Label className="text-sm font-montserrat font-medium text-foreground mb-4 block">
                    Select Date
                  </Label>
                  <div className="bg-charcoal text-ivory rounded-lg p-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-montserrat font-semibold">
                        {new Date().toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </h3>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                      {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                        (day) => (
                          <div key={day} className="p-2 text-ivory/60">
                            {day}
                          </div>
                        )
                      )}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendar().map((date, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedDate(date)}
                          disabled={date < new Date() || !isCurrentMonth(date)}
                          className={`p-2 text-sm rounded transition-colors ${
                            !isCurrentMonth(date)
                              ? "text-ivory/30 cursor-not-allowed"
                              : date < new Date()
                              ? "text-ivory/50 cursor-not-allowed"
                              : selectedDate?.toDateString() ===
                                date.toDateString()
                              ? "bg-terracotta text-ivory"
                              : isToday(date)
                              ? "bg-ivory/20 text-ivory hover:bg-terracotta"
                              : "text-ivory hover:bg-ivory/20"
                          }`}
                        >
                          {date.getDate()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Number of Guests */}
                <div>
                  <Label className="text-sm font-montserrat font-medium text-foreground mb-2 block">
                    Number of Guests
                  </Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Guest{num > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Available Time Slots */}
                <div>
                  <Label className="text-sm font-montserrat font-medium text-foreground mb-4 block">
                    Available Time Slots
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() =>
                          slot.available && setSelectedTime(slot.time)
                        }
                        disabled={!slot.available}
                        className={`p-2 rounded text-sm font-lato transition-colors ${
                          !slot.available
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : selectedTime === slot.time
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary text-foreground hover:bg-accent/20"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guest Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-montserrat font-semibold text-foreground">
                    Your Details
                  </h3>

                  <div>
                    <Label
                      htmlFor="fullName"
                      className="text-sm font-montserrat font-medium text-foreground"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      className="mt-1"
                    />
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
                      htmlFor="phone"
                      className="text-sm font-montserrat font-medium text-foreground"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-4">
                  <h3 className="text-lg font-montserrat font-semibold text-foreground">
                    Special Requests
                  </h3>

                  <div>
                    <Label
                      htmlFor="occasion"
                      className="text-sm font-montserrat font-medium text-foreground"
                    >
                      Occasion
                    </Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="birthday">Birthday</SelectItem>
                        <SelectItem value="anniversary">Anniversary</SelectItem>
                        <SelectItem value="business">
                          Business Dinner
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="dietary"
                      className="text-sm font-montserrat font-medium text-foreground"
                    >
                      Allergies or Dietary Restrictions
                    </Label>
                    <Textarea
                      id="dietary"
                      placeholder="e.g., Nut allergy, Gluten-free"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>

                <Button className="btn-terracotta w-full py-3 text-lg">
                  Confirm Reservation
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Location & Info */}
          <div className="space-y-8 animate-slide-up">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="text-2xl font-montserrat font-bold text-foreground flex items-center gap-2">
                  <MapPin className="text-accent" size={24} />
                  Our Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <p className="text-muted-foreground font-lato">
                    Interactive Map
                  </p>
                </div>

                <Button className="w-full mb-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                  Get Directions
                </Button>

                <p className="text-sm font-lato text-muted-foreground">
                  Valet parking available. Street parking also nearby.
                </p>
              </CardContent>
            </Card>

            {/* Reservation Summary */}
            {selectedDate && selectedTime && (
              <Card className="card-elegant animate-scale-in">
                <CardHeader>
                  <CardTitle className="text-xl font-montserrat font-bold text-foreground">
                    Reservation Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-accent" />
                    <span className="font-lato text-sm">
                      {formatDate(selectedDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-accent" />
                    <span className="font-lato text-sm">{selectedTime}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users size={16} className="text-accent" />
                    <span className="font-lato text-sm">
                      {guests} Guest{parseInt(guests) > 1 ? "s" : ""}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
