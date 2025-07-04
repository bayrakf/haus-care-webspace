import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Home, 
  Leaf, 
  Shield, 
  Clock, 
  CheckCircle, 
  Star, 
  Sparkles, 
  ArrowRight, 
  Award, 
  Users, 
  TrendingUp,
  Phone,
  Mail
} from "lucide-react";
import heroImage from "@/assets/hero-home.jpg";
import servicesImage from "@/assets/services-illustration.jpg";

const HomePage = () => {
  const services = [
    {
      icon: Home,
      title: "Hausreinigung",
      description: "Professionelle Reinigung Ihrer Immobilie mit umweltfreundlichen Produkten.",
    },
    {
      icon: Leaf,
      title: "Gartenpflege",
      description: "Komplette Gartenpflege vom Rasenmähen bis zur Baumpflege.",
    },
    {
      icon: Shield,
      title: "Hausverwaltung",
      description: "Umfassende Betreuung und Verwaltung Ihrer Immobilie.",
    },
    {
      icon: Clock,
      title: "24h Notfalldienst",
      description: "Rund um die Uhr erreichbar für dringende Reparaturen.",
    },
  ];

  const features = [
    "Über 10 Jahre Erfahrung",
    "Versichert und zertifiziert",
    "Kostenlose Erstberatung",
    "Flexible Termine",
    "Faire Preise",
    "Zufriedenheitsgarantie",
  ];

  return (
    <div className="min-h-screen -mt-20">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center pt-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-luxury opacity-20"></div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <div className="animate-float">
            <Badge className="mb-6 bg-gradient-luxury text-white border-0 px-6 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Premium Hausbetreuung seit 2013
            </Badge>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            Luxuriöse 
            <span className="block text-gradient-luxury bg-gradient-luxury bg-clip-text text-transparent">
              Hausbetreuung
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Erleben Sie höchste Qualität in der Immobilienpflege. 
            Wir kümmern uns um Ihr Zuhause mit der Präzision eines Luxushotels.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button size="lg" className="bg-gradient-luxury hover:opacity-90 text-white shadow-luxury text-lg px-12 py-6 hover-scale">
              <Sparkles className="w-5 h-5 mr-3" />
              Exklusive Beratung
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-12 py-6 glass border-white/30 text-white hover:bg-white/20 hover-scale">
              <Link to="/leistungen" className="flex items-center">
                Premium Leistungen
                <ArrowRight className="w-5 h-5 ml-3" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { number: "10+", label: "Jahre Erfahrung", icon: Award },
              { number: "500+", label: "Zufriedene Kunden", icon: Users },
              { number: "99%", label: "Weiterempfehlung", icon: TrendingUp }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="glass rounded-2xl p-6 hover-lift">
                  <Icon className="w-8 h-8 text-accent mb-4 mx-auto" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Unsere Expertise
            </Badge>
            <h2 className="text-5xl font-bold text-foreground mb-6">
              Premium <span className="text-gradient-luxury">Dienstleistungen</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Von der makellose Reinigung bis zur kompletten Hausverwaltung - 
              wir bieten Ihnen einen Rundum-Service auf höchstem Niveau.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="group hover-lift border-0 shadow-card bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-luxury rounded-2xl flex items-center justify-center mx-auto shadow-luxury group-hover:scale-110 transition-transform duration-500">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <Sparkles className="w-6 h-6 text-accent animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Link to="/leistungen">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-white shadow-elegant hover-scale px-12">
                Alle Premium-Leistungen entdecken
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-32 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-secondary/10 text-secondary border-secondary/20">
                Warum HausCare?
              </Badge>
              <h2 className="text-5xl font-bold text-foreground mb-8">
                Ihr Partner für <span className="text-gradient-luxury">Luxuriöse</span> Hausbetreuung
              </h2>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                Mit über 10 Jahren Erfahrung in der exklusiven Hausbetreuung sind wir Ihr 
                zuverlässiger Partner für alle Premium-Immobiliendienstleistungen.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-4 group">
                    <div className="w-10 h-10 bg-gradient-luxury rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-foreground font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/kontakt">
                  <Button className="bg-gradient-secondary hover:opacity-90 text-white shadow-elegant hover-scale px-8">
                    <Phone className="w-5 h-5 mr-3" />
                    Jetzt Kontakt aufnehmen
                  </Button>
                </Link>
                <Button variant="outline" className="px-8 hover-scale">
                  <Mail className="w-5 h-5 mr-3" />
                  E-Mail senden
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-luxury opacity-20 rounded-3xl transform rotate-6"></div>
              <img 
                src={servicesImage} 
                alt="Unsere Premium Dienstleistungen" 
                className="relative rounded-3xl shadow-luxury w-full hover-lift"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
              Kundenmeinungen
            </Badge>
            <h2 className="text-5xl font-bold text-foreground mb-6">
              Das sagen unsere <span className="text-gradient-luxury">VIP-Kunden</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Zufriedene Kunden sind unser bester Beweis für außergewöhnliche Qualität
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Schmidt",
                title: "Villa-Besitzerin",
                text: "Absolut außergewöhnlich! Das Team arbeitet mit der Präzision und Sorgfalt eines 5-Sterne-Hotels.",
                rating: 5,
              },
              {
                name: "Dr. Thomas Weber",
                title: "Geschäftsführer",
                text: "Die Gartenpflege ist weltklasse. Unser Anwesen sieht das ganze Jahr über makellos aus.",
                rating: 5,
              },
              {
                name: "Anna Müller",
                title: "Immobilien-Investorin",
                text: "Professioneller Service der Luxusklasse. Jeden Euro wert und absolut empfehlenswert!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="glass border-0 shadow-card hover-lift">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-accent fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic text-lg leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t border-border/50 pt-4">
                    <p className="font-bold text-foreground text-lg">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.title}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-luxury opacity-90"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-float">
            <Sparkles className="w-16 h-16 text-accent mx-auto mb-8" />
          </div>
          
          <h2 className="text-6xl font-bold mb-8">
            Bereit für Luxus-Hausbetreuung?
          </h2>
          <p className="text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Kontaktieren Sie uns heute für eine exklusive, kostenlose Beratung 
            und erleben Sie Service auf höchstem Niveau
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/kontakt">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 shadow-luxury text-xl px-12 py-6 hover-scale">
                <Sparkles className="w-6 h-6 mr-3" />
                Exklusive Beratung
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-xl px-12 py-6 hover-scale">
              <Phone className="w-6 h-6 mr-3" />
              +49 123 456 789
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;