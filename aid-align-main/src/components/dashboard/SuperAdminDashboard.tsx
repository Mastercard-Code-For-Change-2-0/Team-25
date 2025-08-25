import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, HandHeart, GitMerge, CheckCircle, Clock, Users } from "lucide-react";
import { mockDonors, mockReceivers, mockMatches } from "@/data/mockData";
import { NavLink } from "react-router-dom";

const SuperAdminDashboard = () => {
  const totalDonors = mockDonors.length;
  const totalReceivers = mockReceivers.length;
  const pendingMatches = mockMatches.filter(m => m.status === "pending").length;
  const approvedMatches = mockMatches.filter(m => m.status === "approved").length;
  const totalDonations = mockDonors.reduce((sum, donor) => sum + donor.items.length, 0);
  const totalRequests = mockReceivers.reduce((sum, receiver) => sum + receiver.requestedItems.length, 0);

  const stats = [
    {
      title: "Total Donors",
      value: totalDonors,
      icon: Users,
      description: "Active donors in system",
      color: "text-ngo-blue-500",
      bgColor: "bg-ngo-blue-50"
    },
    {
      title: "Total Receivers", 
      value: totalReceivers,
      icon: HandHeart,
      description: "Organizations needing help",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Available Donations",
      value: totalDonations,
      icon: Heart,
      description: "Items ready for matching",
      color: "text-info",
      bgColor: "bg-info/10"
    },
    {
      title: "Pending Requests",
      value: totalRequests, 
      icon: Clock,
      description: "Items requested by organizations",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "Suggested Matches",
      value: pendingMatches,
      icon: GitMerge,
      description: "Matches waiting for approval",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Approved Matches",
      value: approvedMatches,
      icon: CheckCircle,
      description: "Successfully matched items",
      color: "text-success",
      bgColor: "bg-success/10"
    }
  ];

  const recentActivity = [
    {
      type: "donation",
      message: "New donation from Tech Solutions Inc.",
      time: "2 hours ago",
      icon: Heart
    },
    {
      type: "request", 
      message: "Hope Shelter requested blankets",
      time: "4 hours ago",
      icon: HandHeart
    },
    {
      type: "match",
      message: "New match found: Laptops for Bright Future School",
      time: "6 hours ago", 
      icon: GitMerge
    },
    {
      type: "approval",
      message: "Match approved: Blankets for Hope Shelter",
      time: "1 day ago",
      icon: CheckCircle
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage donations and matches efficiently</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <NavLink to="/app/matches">
              <Button variant="ngo" className="w-full justify-start" size="lg">
                <GitMerge className="mr-2 h-5 w-5" />
                Review Suggested Matches ({pendingMatches})
              </Button>
            </NavLink>
            <NavLink to="/app/donations">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Heart className="mr-2 h-5 w-5" />
                View All Donations
              </Button>
            </NavLink>
            <NavLink to="/app/requests"> 
              <Button variant="outline" className="w-full justify-start" size="lg">
                <HandHeart className="mr-2 h-5 w-5" />
                View All Requests
              </Button>
            </NavLink>
            <NavLink to="/app/reports">
              <Button variant="secondary" className="w-full justify-start" size="lg">
                <CheckCircle className="mr-2 h-5 w-5" />
                Generate Reports
              </Button>
            </NavLink>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-full bg-primary/10">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;