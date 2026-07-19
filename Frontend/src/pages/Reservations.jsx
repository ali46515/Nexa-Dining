import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Users, LoaderCircle } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
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

const toDateValue = (date) => date.toISOString().slice(0, 10);
const Reservations = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(() =>
    toDateValue(new Date(Date.now() + 86400000)),
  );
  const [guests, setGuests] = useState("2");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState(() => ({
    fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    email: user?.email || "",
    phone: user?.phone || "",
    occasion: "none",
    specialRequests: "",
    dietaryRestrictions: "",
  }));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  useEffect(() => {
    setForm((current) => ({
      ...current,
      fullName:
        current.fullName ||
        `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      email: current.email || user?.email || "",
      phone: current.phone || user?.phone || "",
    }));
  }, [user]);
  useEffect(() => {
    let current = true;
    const load = async () => {
      setLoadingSlots(true);
      setError("");
      try {
        const result = await api(
          `/api/reservations/timeslots?date=${date}&guestCount=${guests}`,
        );
        if (current) {
          setSlots(result.data.timeSlots);
          setTime((selected) =>
            result.data.timeSlots.some(
              (slot) => slot.time === selected && slot.isAvailable,
            )
              ? selected
              : "",
          );
        }
      } catch (err) {
        if (current) setError(err.message);
      } finally {
        if (current) setLoadingSlots(false);
      }
    };
    load();
    return () => {
      current = false;
    };
  }, [date, guests]);
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!time) return setError("Please choose an available time slot.");
    setSaving(true);
    try {
      await api("/api/reservations", {
        method: "POST",
        token: user.token,
        body: {
          ...form,
          date,
          time,
          guestCount: Number(guests),
          dietaryRestrictions: form.dietaryRestrictions
            ? form.dietaryRestrictions
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
            : [],
        },
      });
      setMessage(
        "Your reservation request has been received. We’ll email you with the confirmation.",
      );
      setTime("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="text-2xl">Make a Reservation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="date">Select date</Label>
                    <Input
                      id="date"
                      className="mt-2"
                      type="date"
                      value={date}
                      min={toDateValue(new Date())}
                      max={toDateValue(new Date(Date.now() + 7776000000))}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="guests">Number of guests</Label>
                    <select
                      id="guests"
                      className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                    >
                      {Array.from({ length: 20 }, (_, index) => (
                        <option key={index + 1}>{index + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Available time slots</Label>
                  {loadingSlots ? (
                    <div className="py-5 flex items-center gap-2 text-muted-foreground">
                      <LoaderCircle className="animate-spin" size={16} />
                      Checking availability…
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                      {slots.map((slot) => (
                        <button
                          type="button"
                          key={slot.time}
                          disabled={!slot.isAvailable}
                          onClick={() => setTime(slot.time)}
                          className={`rounded px-3 py-2 text-sm ${!slot.isAvailable ? "bg-muted text-muted-foreground cursor-not-allowed" : time === slot.time ? "bg-accent text-accent-foreground" : "bg-secondary hover:bg-accent/20"}`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      className="mt-2"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      className="mt-2"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    className="mt-2"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="occasion">Occasion</Label>
                    <select
                      id="occasion"
                      className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={form.occasion}
                      onChange={(e) =>
                        setForm({ ...form, occasion: e.target.value })
                      }
                    >
                      {[
                        "none",
                        "birthday",
                        "anniversary",
                        "business",
                        "other",
                      ].map((item) => (
                        <option key={item} value={item}>
                          {item === "none" ? "None" : item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="dietary">Dietary restrictions</Label>
                    <Input
                      id="dietary"
                      className="mt-2"
                      placeholder="e.g. vegetarian, nut allergy"
                      value={form.dietaryRestrictions}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          dietaryRestrictions: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="requests">Special requests</Label>
                  <Textarea
                    id="requests"
                    className="mt-2"
                    value={form.specialRequests}
                    onChange={(e) =>
                      setForm({ ...form, specialRequests: e.target.value })
                    }
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                {message && <p className="text-sm text-sage">{message}</p>}
                <Button
                  disabled={saving || loadingSlots}
                  className="btn-terracotta w-full py-3"
                >
                  {saving ? "Submitting…" : "Confirm Reservation"}
                </Button>
              </form>
            </CardContent>
          </Card>
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

            <aside className="space-y-6">
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle>Reservation Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p className="flex gap-3">
                    <Calendar className="text-accent" size={18} />
                    {new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="flex gap-3">
                    <Clock className="text-accent" size={18} />
                    {time || "Choose a time"}
                  </p>
                  <p className="flex gap-3">
                    <Users className="text-accent" size={18} />
                    {guests} guest{guests !== "1" ? "s" : ""}
                  </p>
                </CardContent>
              </Card>
              <Card className="card-elegant">
                <CardContent className="p-6">
                  <h2 className="font-montserrat text-xl font-semibold">
                    Dining at Nexa
                  </h2>
                  <p className="mt-3 text-muted-foreground">
                    Reservations can be made up to three months ahead. Your table
                    is held once the team confirms your request.
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Reservations;
