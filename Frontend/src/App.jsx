import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Reservations from "./pages/Reservations";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import LoginRequired from "./components/LoginRequired";
import AdminRequired from "./components/AdminRequired";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";

// Initialize QueryClient for React Query
const queryClient = new QueryClient();

const App = () => (
  // Provide QueryClient to the entire application for data fetching and caching
  <QueryClientProvider client={queryClient}>
    {/* Provide Tooltip context for UI components */}
    <TooltipProvider>
      {/* Toaster for displaying traditional toast notifications */}
      <Toaster />
      {/* Sonner for displaying modern, accessible toast notifications */}
      <Sonner />
      {/* BrowserRouter enables client-side routing */}
      <AuthProvider>
        <BrowserRouter>
        {/* Main container for the application, set to take minimum full height and use flexbox for layout */}
        <div className="min-h-screen flex flex-col">
          {/* Navbar component, fixed at the top */}
          <Navbar />
          {/* Main content area, flex-1 makes it grow to fill available space */}
          <main className="flex-1">
            {/* Routes component defines the application's routes */}
            <Routes>
              {/* Route for the home page */}
              <Route path="/" element={<Home />} />
              {/* Route for the menu page */}
              <Route path="/menu" element={<Menu />} />
              {/* Route for the about page */}
              <Route path="/about" element={<About />} />
              {/* Route for the gallery page */}
              <Route path="/gallery" element={<Gallery />} />
              {/* Route for the reservations page */}
              <Route
                path="/reservations"
                element={
                  <LoginRequired>
                    <Reservations />
                  </LoginRequired>
                }
              />
              {/* Route for the contact page */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<AdminRequired><AdminDashboard /></AdminRequired>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          {/* Footer component, fixed at the bottom */}
          <Footer />
        </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
