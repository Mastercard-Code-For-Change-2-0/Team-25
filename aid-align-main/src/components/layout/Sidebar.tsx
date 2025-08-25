import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Heart, 
  HandHeart, 
  GitMerge, 
  FileText, 
  LayoutDashboard,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems = [
    { 
      label: "Dashboard", 
      path: "/app/dashboard", 
      icon: LayoutDashboard,
      description: "Overview & Analytics"
    },
    { 
      label: "Donations", 
      path: "/app/donations", 
      icon: Heart,
      description: "Manage Donations"
    },
    { 
      label: "Requests", 
      path: "/app/requests", 
      icon: HandHeart,
      description: "Track Requests"
    },
    { 
      label: "Suggested Matches", 
      path: "/app/matches", 
      icon: GitMerge,
      description: "Review Matches"
    },
    { 
      label: "Reports", 
      path: "/app/reports", 
      icon: FileText,
      description: "Generate Reports"
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn(
      "bg-white border-r border-border h-full flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Collapse Toggle */}
      <div className="flex justify-end p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className={cn(
                  "flex-shrink-0 transition-colors",
                  isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
                )} />
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    <span className="text-xs opacity-75">{item.description}</span>
                  </div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;