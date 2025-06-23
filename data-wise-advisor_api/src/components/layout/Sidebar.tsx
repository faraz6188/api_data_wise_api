import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  MessageSquare,
  BarChart,
  Upload,
  Database,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ADMIN_EMAIL = "admin@example.com";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Home",
      icon: Home,
      path: "/",
    },
    {
      name: "AI Chat",
      icon: MessageSquare,
      path: "/chat",
    },
    {
      name: "Visualize",
      icon: BarChart,
      path: "/visualize",
    },
    {
      header: "Data Management",
    },
    {
      name: "Upload Data",
      icon: Upload,
      path: "/upload",
    },
    {
      name: "Data Sources",
      icon: Database,
      path: "/sources",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
      position: "bottom",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    navigate("/auth");
  };

  return (
    <aside className="bg-sidebar w-64 h-screen flex flex-col border-r border-gray-800">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-bizoracle-blue flex items-center justify-center">
            <span className="font-bold text-white">BO</span>
          </div>
          <h1 className="text-xl font-bold text-white">BizOracle</h1>
        </div>
      </div>

      <div className="text-xs uppercase text-gray-400 px-6 mb-4">Dashboard</div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item, index) => {
          if (item.header) {
            return (
              <div key={index} className="text-xs uppercase text-gray-400 px-3 pt-6 pb-2">
                {item.header}
              </div>
            );
          }

          if (item.position === "bottom") {
            return null;
          }

          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={index}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-white"
                  : "text-gray-300 hover:bg-sidebar-accent/50 hover:text-white"
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 mt-auto flex flex-col gap-2">
        {navItems
          .filter((item) => item.position === "bottom")
          .map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={index}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-white"
                    : "text-gray-300 hover:bg-sidebar-accent/50 hover:text-white"
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        {/* Admin dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-sidebar-accent/80 hover:bg-sidebar-accent text-white transition-colors">
              <Avatar>
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="flex-1 text-left">Admin</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Admin
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-3 py-1 text-xs text-muted-foreground">
              <div>Email: <span className="font-medium">{ADMIN_EMAIL}</span></div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};

export default Sidebar;
