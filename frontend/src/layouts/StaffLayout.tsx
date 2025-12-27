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
      <div className="flex h-screen w-full overflow-hidden bg-gray-50">
        <StaffSidebar />
        <div className="flex flex-1 flex-col overflow-hidden relative">
          <Topbar />
          <main className="flex-1 overflow-auto bg-gray-50 p-6 relative z-0">
            <div className="relative z-10">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
