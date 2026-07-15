import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer = () => {
  return (
    <footer className="bg-charcoal text-ivory">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-montserrat font-bold">NEXA DINING</h3>
            <p className="text-sm font-lato text-ivory/80">
              Where Art Meets Flavor
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-montserrat font-semibold">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-sm font-lato">
              <li>
                <a
                  href="/menu"
                  className="text-ivory/80 hover:text-terracotta transition-colors"
                >
                  Menu
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-ivory/80 hover:text-terracotta transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/gallery"
                  className="text-ivory/80 hover:text-terracotta transition-colors"
                >
                  Gallery
                </a>
              </li>              
              <li>
                <a
                  href="/contact"
                  className="text-ivory/80 hover:text-terracotta transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-montserrat font-semibold">
              STAY CONNECTED
            </h4>
            <p className="text-sm font-lato text-ivory/80">
              Sign up for our newsletter:
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Your email"
                className="bg-ivory/10 border-ivory/20 text-ivory placeholder:text-ivory/60"
              />
              <Button className="btn-terracotta px-4">Subscribe</Button>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-montserrat font-semibold">
              CONTACT US
            </h4>
            <div className="space-y-3 text-sm font-lato text-ivory/80">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-terracotta" />
                <span>info@nexadining.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-terracotta" />
                <span>+1 (123) 456-7890</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-terracotta" />
                <span>123 Culinary Lane, Metropolis</span>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Instagram
                  size={20}
                  className="text-terracotta hover:text-ivory transition-colors cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-ivory/20 mt-8 pt-8 text-center">
          <p className="text-sm font-lato text-ivory/60">
            © 2025 Nexa Dining. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
