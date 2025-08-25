import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Calendar, Eye } from "lucide-react";
import { mockMatches } from "@/data/mockData";

const CoordinatorDashboard = () => {
  // Filter matches assigned to coordinator (for demo, showing approved matches)
  const assignedMatches = mockMatches.filter(match => 
    match.status === "approved" || match.status === "completed"
  );

  const completedMatches = assignedMatches.filter(m => m.status === "completed").length;
  const activeMatches = assignedMatches.filter(m => m.status === "approved").length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned Matches</p>
                <p className="text-2xl font-bold">{assignedMatches.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Deliveries</p>
                <p className="text-2xl font-bold">{activeMatches}</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10">
                <MapPin className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedMatches}</p>
              </div>
              <div className="p-3 rounded-lg bg-success/10">
                <Calendar className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Matches */}
      <Card>
        <CardHeader>
          <CardTitle>My Assigned Matches</CardTitle>
          <CardDescription>
            Donations and matches you're coordinating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignedMatches.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No assigned matches</h3>
                <p className="text-muted-foreground">You'll see your assigned coordination tasks here.</p>
              </div>
            ) : (
              assignedMatches.map((match) => (
                <div key={match.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{match.itemName}</h4>
                        <Badge variant={match.status === "completed" ? "default" : "secondary"}>
                          {match.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <p><strong>From:</strong> {match.donorName}</p>
                          <p><strong>Quantity:</strong> {match.donatedQuantity} {match.unit}</p>
                        </div>
                        <div>
                          <p><strong>To:</strong> {match.receiverName}</p>
                          <p><strong>Needed:</strong> {match.requestedQuantity} {match.unit}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Matched on: {match.matchedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoordinatorDashboard;