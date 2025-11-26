import { ReactNode } from "react";
import { SidebarProvider } from "../components/ui/sidebar";
import { StaffSidebar } from "../components/StaffSidebar";
import { Topbar } from "../components/Topbar";

interface StaffLayoutProps {
  children: ReactNode;
}

export function StaffLayout({ children }: StaffLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <StaffSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-auto bg-muted/20 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
