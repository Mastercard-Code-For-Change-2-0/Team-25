import { useAuth } from "@/hooks/useAuth";
import SuperAdminDashboard from "@/components/dashboard/SuperAdminDashboard";
import CoordinatorDashboard from "@/components/dashboard/CoordinatorDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Here's what's happening today.
          </p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium capitalize">
          {user.role.replace("_", " ")}
        </div>
      </div>

      {user.role === "super_admin" && <SuperAdminDashboard />}
      {user.role === "coordinator" && <CoordinatorDashboard />}
    </div>
  );
};

export default Dashboard;