import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const LoginRequired = ({ children }) => {
  const { isAuthenticated, login, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Signup state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  
  // Shared state
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) return children;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await register({
          firstName,
          lastName,
          email,
          password,
          phone,
        });
      } else {
        await login(email, password);
      }
      navigate(location.pathname, { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    // Reset form fields when toggling
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setPhone("");
  };

  return (
    <div className="min-h-screen bg-background pt-24 flex items-center justify-center px-6">
      <div className="w-full max-w-md card-elegant p-6 sm:p-8 animate-fade-in">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-montserrat font-bold text-foreground">
              {isSignUp ? "Create an account" : "Sign in to continue"}
            </h1>
            <p className="mt-2 font-lato text-muted-foreground">
              {isSignUp 
                ? "Create your account to make reservations." 
                : "Please sign in to make a reservation."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-1"
                  required
                />
              </div>
            </>
          )}
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1"
              required
              minLength={6}
            />
          </div>
          
          {error && <p className="text-sm text-destructive">{error}</p>}
          
          <Button
            type="submit"
            className="btn-terracotta w-full py-3"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (isSignUp ? "Creating Account..." : "Signing in...") 
              : (isSignUp ? "Create Account" : "Sign In")}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              onClick={toggleMode}
              className="ml-1 text-primary hover:underline font-medium"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRequired;