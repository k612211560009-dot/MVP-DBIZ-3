import { Home, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <h3 className="text-[18px] font-semibold text-primary">Milk Bank</h3>
          
          <nav className="hidden md:flex items-center gap-2 text-[13px] text-muted-foreground">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span>Donate Milk</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Register</span>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-[13px] font-medium">Pham Thi Lan</p>
            <p className="text-[12px] text-muted-foreground">Mother</p>
          </div>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">PL</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
