import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { mockDonors, mockReceivers, mockMatches } from "@/data/mockData";
import { Match } from "@/types/donations";
import { Eye, MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SuggestedMatches = () => {
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [approvedMatches, setApprovedMatches] = useState<Match[]>([]);
  const { toast } = useToast();

  const handleApproveMatch = (matchId: string) => {
    const matchToApprove = matches.find(m => m.id === matchId);
    if (matchToApprove) {
      // Update match status and move to approved
      const updatedMatch = { 
        ...matchToApprove, 
        status: "approved" as const,
        approvedAt: new Date()
      };
      
      setMatches(prev => prev.filter(m => m.id !== matchId));
      setApprovedMatches(prev => [...prev, updatedMatch]);
      
      toast({
        title: "Match Approved!",
        description: `Successfully approved ${matchToApprove.itemName} match between ${matchToApprove.donorName} and ${matchToApprove.receiverName}.`,
      });
    }
  };

  const DonorDetailsDialog = ({ donor }: { donor: any }) => (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center">
          <CheckCircle2 className="mr-2 h-5 w-5 text-success" />
          {donor.name}
        </DialogTitle>
        <DialogDescription>Donor Details & Available Items</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            {donor.email}
          </div>
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            {donor.phone}
          </div>
          <div className="flex items-center text-sm col-span-2">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            {donor.location}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Available Items:</h4>
          <div className="space-y-2">
            {donor.items.map((item: any) => (
              <div key={item.id} className="flex justify-between p-2 bg-muted rounded">
                <span className="font-medium">{item.name}</span>
                <Badge variant="secondary">{item.quantity} {item.unit}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DialogContent>
  );

  const ReceiverDetailsDialog = ({ receiver }: { receiver: any }) => (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center">
          <CheckCircle2 className="mr-2 h-5 w-5 text-info" />
          {receiver.name}
        </DialogTitle>
        <DialogDescription>Receiver Details & Requested Items</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            {receiver.email}
          </div>
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            {receiver.phone}
          </div>
          <div className="flex items-center text-sm col-span-2">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            {receiver.location}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Requested Items:</h4>
          <div className="space-y-2">
            {receiver.requestedItems.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center p-2 bg-muted rounded">
                <div className="flex-1">
                  <span className="font-medium">{item.name}</span>
                  <Badge 
                    variant={item.urgency === "high" ? "destructive" : item.urgency === "medium" ? "secondary" : "outline"}
                    className="ml-2"
                  >
                    {item.urgency}
                  </Badge>
                </div>
                <Badge variant="secondary">{item.quantity} {item.unit}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Suggested Matches</h1>
        <p className="text-muted-foreground">Review and approve donation matches</p>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Donor List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-success" />
              Donors ({mockDonors.length})
            </CardTitle>
            <CardDescription>Organizations and individuals offering donations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockDonors.map((donor) => (
              <div key={donor.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{donor.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{donor.location}</p>
                    <div className="flex flex-wrap gap-1">
                      {donor.items.slice(0, 2).map((item) => (
                        <Badge key={item.id} variant="outline" className="text-xs">
                          {item.name} ({item.quantity})
                        </Badge>
                      ))}
                      {donor.items.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{donor.items.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DonorDetailsDialog donor={donor} />
                  </Dialog>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Receiver List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-info" />
              Receivers ({mockReceivers.length})
            </CardTitle>
            <CardDescription>Organizations requesting assistance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockReceivers.map((receiver) => (
              <div key={receiver.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{receiver.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{receiver.location}</p>
                    <div className="flex flex-wrap gap-1">
                      {receiver.requestedItems.slice(0, 2).map((item) => (
                        <Badge 
                          key={item.id} 
                          variant={item.urgency === "high" ? "destructive" : "outline"}
                          className="text-xs"
                        >
                          {item.name} ({item.quantity})
                        </Badge>
                      ))}
                      {receiver.requestedItems.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{receiver.requestedItems.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <ReceiverDetailsDialog receiver={receiver} />
                  </Dialog>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Suggested Matches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
              Suggested Matches ({matches.length})
            </CardTitle>
            <CardDescription>AI-generated matches based on overlapping items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {matches.map((match) => (
                <div key={match.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {match.itemName}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`match-${match.id}`}
                        onCheckedChange={() => handleApproveMatch(match.id)}
                      />
                      <label 
                        htmlFor={`match-${match.id}`}
                        className="text-xs font-medium cursor-pointer"
                      >
                        Items Matched
                      </label>
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>From:</strong> {match.donorName}</p>
                    <p><strong>To:</strong> {match.receiverName}</p>
                    <p><strong>Available:</strong> {match.donatedQuantity} {match.unit}</p>
                    <p><strong>Needed:</strong> {match.requestedQuantity} {match.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approved Matches Table */}
      {approvedMatches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-success" />
              Approved Matches ({approvedMatches.length})
            </CardTitle>
            <CardDescription>Successfully approved matches ready for coordination</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor Name</TableHead>
                  <TableHead>Item Offered</TableHead>
                  <TableHead>Receiver Name</TableHead>
                  <TableHead>Item Requested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Approved Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedMatches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell className="font-medium">{match.donorName}</TableCell>
                    <TableCell>
                      {match.itemName}
                      <div className="text-xs text-muted-foreground">
                        {match.donatedQuantity} {match.unit}
                      </div>
                    </TableCell>
                    <TableCell>{match.receiverName}</TableCell>
                    <TableCell>
                      {match.itemName}
                      <div className="text-xs text-muted-foreground">
                        {match.requestedQuantity} {match.unit}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Approved</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {match.approvedAt?.toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SuggestedMatches;