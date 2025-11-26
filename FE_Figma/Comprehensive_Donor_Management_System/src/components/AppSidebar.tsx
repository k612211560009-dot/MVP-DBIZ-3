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
} from './ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  User,
  Droplet,
  TestTube,
  Bell,
  FileText,
  Gift,
  CreditCard,
  Settings,
  LogOut,
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const menuItems = [
  {
    title: 'Tổng quan',
    items: [
      { title: 'Dashboard', icon: LayoutDashboard, url: '/' },
    ],
  },
  {
    title: 'Quản lý Donor',
    items: [
      { title: 'Danh sách Donor', icon: Users, url: '/donors' },
      { title: 'Lịch hẹn', icon: Calendar, url: '/appointments' },
      { title: 'Sàng lọc', icon: ClipboardList, url: '/screening' },
    ],
  },
  {
    title: 'Hiến sữa',
    items: [
      { title: 'Nhật ký hiến sữa', icon: Droplet, url: '/donations' },
      { title: 'Ghi nhận hiến sữa', icon: FileText, url: '/record-donation' },
    ],
  },
  {
    title: 'Y tế',
    items: [
      { title: 'Xét nghiệm EHR', icon: TestTube, url: '/ehr-tests' },
      { title: 'Cảnh báo', icon: Bell, url: '/alerts' },
    ],
  },
  {
    title: 'Báo cáo & Hỗ trợ',
    items: [
      { title: 'Báo cáo', icon: FileText, url: '/reports' },
      { title: 'Cấu hình quà tặng', icon: Gift, url: '/rewards' },
      { title: 'Hỗ trợ thanh toán', icon: CreditCard, url: '/payments' },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <Droplet className="h-8 w-8 text-primary" />
          <div>
            <h2>MilkBank Admin</h2>
            <p className="text-muted-foreground">Quản lý ngân hàng sữa mẹ</p>
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
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate">Bs. Nguyễn Văn A</p>
            <p className="text-muted-foreground truncate">Director</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground w-full">
          <LogOut className="h-4 w-4" />
          <span>Đăng xuất</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
