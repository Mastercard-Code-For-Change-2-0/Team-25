import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import { Heart, GitMerge, Users, CheckCircle } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Heart,
      title: "Donation Management",
      description: "Efficiently track and manage all incoming donations from various sources."
    },
    {
      icon: Users,
      title: "Receiver Coordination",
      description: "Connect with organizations and individuals who need assistance."
    },
    {
      icon: GitMerge,
      title: "Smart Matching",
      description: "AI-powered matching system to connect donors with receivers effectively."
    },
    {
      icon: CheckCircle,
      title: "Approval Workflow",
      description: "Streamlined approval process for donation matches and coordination."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ngo-blue-50 via-white to-ngo-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-6 shadow-lg">
            <Heart className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Welcome to <span className="text-primary">DonateLink</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Connecting generosity with need through our intelligent donation-demand matching platform. 
            Streamline the process of helping those who need it most.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink to="/login">
              <Button variant="ngo" size="lg" className="w-full sm:w-auto">
                Access Dashboard
              </Button>
            </NavLink>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">Making a Difference</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Successful Matches</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">50+</div>
              <div className="text-muted-foreground">Partner Organizations</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">1000+</div>
              <div className="text-muted-foreground">Lives Impacted</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Start Making a Difference?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join our platform and help us connect donations with those who need them most.
          </p>
          <NavLink to="/login">
            <Button variant="ngo" size="lg">
              Get Started Today
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Index;
