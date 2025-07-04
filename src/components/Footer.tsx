import { Link } from "react-router-dom";
import { Home, Phone, Mail, MapPin, Sparkles, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-muted border-t border-border/50">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-luxury rounded-xl flex items-center justify-center shadow-luxury">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold text-gradient-luxury">HausCare</span>
                <div className="text-xs text-muted-foreground">Premium Service</div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Ihr exklusiver Partner für luxuriöse Hausbetreuung und Premium-Immobilienpflege. 
              Service auf höchstem Niveau seit über 10 Jahren.
            </p>
            <Badge className="bg-gradient-luxury text-white border-0">
              <Sparkles className="w-3 h-3 mr-2" />
              5-Sterne Qualität
            </Badge>
          </div>

          {/* Premium Services */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground flex items-center">
              <Sparkles className="w-5 h-5 text-accent mr-2" />
              Premium Leistungen
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Luxury Hausreinigung", link: "/leistungen" },
                { name: "Exklusive Gartenpflege", link: "/leistungen" },
                { name: "VIP Hausverwaltung", link: "/leistungen" },
                { name: "24/7 Concierge Service", link: "/leistungen" }
              ].map((service, index) => (
                <li key={index}>
                  <Link 
                    to={service.link} 
                    className="flex items-center text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground">Navigation</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", link: "/" },
                { name: "Premium Leistungen", link: "/leistungen" },
                { name: "VIP Kontakt", link: "/kontakt" },
                { name: "Rechnungs-Generator", link: "/rechnungsgenerator", isSpecial: true },
                { name: "Impressum", link: "/impressum" }
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.link} 
                    className="flex items-center text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    {item.name}
                    {item.isSpecial && (
                      <Badge variant="secondary" className="ml-2 text-xs bg-gradient-luxury text-white">
                        NEU
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & CTA */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground">Exklusiver Kontakt</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-foreground">+49 123 456 789</div>
                  <div className="text-sm">Mo-Fr: 8:00-18:00 Uhr</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-muted-foreground">
                <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-foreground">vip@hauscare.de</div>
                  <div className="text-sm">24h Premium Support</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-muted-foreground">
                <div className="w-8 h-8 bg-gradient-luxury rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Luxury District</div>
                  <div className="text-sm">Berlin Premium Zone</div>
                </div>
              </div>
            </div>

            <Link to="/kontakt">
              <Button className="w-full bg-gradient-luxury hover:opacity-90 text-white shadow-luxury">
                <Sparkles className="w-4 h-4 mr-2" />
                VIP Beratung
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center text-muted-foreground">
              <span>&copy; 2024 HausCare Premium Services. Alle Rechte vorbehalten.</span>
              <Heart className="w-4 h-4 text-accent ml-2" />
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/impressum" className="hover:text-primary transition-colors">
                Datenschutz
              </Link>
              <Link to="/impressum" className="hover:text-primary transition-colors">
                AGB
              </Link>
              <Badge className="bg-gradient-luxury text-white border-0 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Premium Zertifiziert
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;