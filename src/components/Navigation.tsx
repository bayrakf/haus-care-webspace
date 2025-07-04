import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Phone, FileText, Wrench, Calculator, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/leistungen", label: "Leistungen", icon: Wrench },
    { path: "/kontakt", label: "Kontakt", icon: Phone },
    { path: "/rechnungsgenerator", label: "Rechnungen", icon: Calculator, isSpecial: true },
    { path: "/impressum", label: "Impressum", icon: FileText },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-luxury rounded-xl flex items-center justify-center shadow-luxury group-hover:scale-110 transition-transform duration-300">
                <Home className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                </div>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold text-gradient-luxury">HausCare</span>
              <div className="text-xs text-muted-foreground">Premium Service</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 group ${
                    isActive
                      ? "text-primary bg-primary/10 shadow-lg"
                      : "text-foreground/70 hover:text-foreground hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                  {item.isSpecial && (
                    <Badge variant="secondary" className="ml-1 text-xs bg-gradient-luxury text-white">
                      NEU
                    </Badge>
                  )}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-lg animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button className="bg-gradient-luxury hover:opacity-90 text-white shadow-luxury hover-scale">
              <Sparkles className="w-4 h-4 mr-2" />
              Kostenlose Beratung
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg glass text-foreground"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 glass border-t border-white/10 py-4">
            <div className="flex flex-col space-y-2 px-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-foreground/70 hover:text-foreground hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.isSpecial && (
                      <Badge variant="secondary" className="ml-auto text-xs bg-gradient-luxury text-white">
                        NEU
                      </Badge>
                    )}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-white/10">
                <Button className="w-full bg-gradient-luxury hover:opacity-90 text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Kostenlose Beratung
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;