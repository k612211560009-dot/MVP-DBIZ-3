import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { SidebarTrigger } from "./ui/sidebar";

export function Topbar() {
  return (
    <header className="relative z-50 flex h-[73px] items-center gap-4 border-b border-gray-200 bg-white px-6">
      <SidebarTrigger />

      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search donor, ID, phone number..."
            className="pl-10"
          />
        </div>
      </div>
    </header>
  );
}
