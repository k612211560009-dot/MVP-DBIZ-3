import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "./ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Droplet,
  TestTube,
  Bell,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, url: "/staff/dashboard" },
    ],
  },
  {
    title: "Donor Management",
    items: [
      { title: "Donor List", icon: Users, url: "/staff/donors" },
      { title: "Appointments", icon: Calendar, url: "/staff/appointments" },
      {
        title: "Visit Confirmation",
        icon: ClipboardList,
        url: "/staff/visit-schedules",
      },
      { title: "Screening", icon: ClipboardList, url: "/staff/screening" },
    ],
  },
  {
    title: "Donations",
    items: [{ title: "Donation Log", icon: Droplet, url: "/staff/donations" }],
  },
  {
    title: "Medical & Support",
    items: [
      { title: "EHR Tests", icon: TestTube, url: "/staff/ehr-tests" },
      { title: "Alerts", icon: Bell, url: "/staff/alerts" },
      { title: "Payments", icon: CreditCard, url: "/staff/payments" },
    ],
  },
];

export function StaffSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true }); // Navigate to landing page after logout
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-gray-200 px-6 py-4 h-[73px] flex items-center">
        <div className="flex items-center gap-2">
          <Droplet className="h-8 w-8 text-primary" />
          <div>
            <h2 className="font-semibold text-lg">MilkBank Staff</h2>
            <p className="text-xs text-muted-foreground">
              {user?.name || "Medical Staff"}
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
