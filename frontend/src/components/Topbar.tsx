import { Bell, Search } from 'lucide-react';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { SidebarTrigger } from './ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { mockAlerts } from '../lib/mock-data';
import { useNavigate } from 'react-router-dom';

export function Topbar() {
  const navigate = useNavigate();
  const activeAlerts = mockAlerts.filter(a => a.status === 'active');

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />
      
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm donor, ID, số điện thoại..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative">
              <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              {activeAlerts.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {activeAlerts.length}
                </Badge>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2">
              <h3>Cảnh báo ({activeAlerts.length})</h3>
            </div>
            {activeAlerts.slice(0, 5).map((alert) => (
              <DropdownMenuItem
                key={alert.id}
                onClick={() => navigate('/alerts')}
                className="cursor-pointer"
              >
                <div className="flex flex-col gap-1 py-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'}>
                      {alert.priority === 'high' ? 'Cao' : alert.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                    </Badge>
                    <span>{alert.donorName}</span>
                  </div>
                  <p className="text-muted-foreground">{alert.message}</p>
                </div>
              </DropdownMenuItem>
            ))}
            {activeAlerts.length > 5 && (
              <DropdownMenuItem
                onClick={() => navigate('/alerts')}
                className="cursor-pointer justify-center"
              >
                Xem tất cả cảnh báo
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground">NA</span>
        </div>
      </div>
    </header>
  );
}
