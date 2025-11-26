import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
  } | null;
  breadcrumbs?: { label: string; href?: string }[];
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function Header({ user, breadcrumbs, onNavigate, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0]">
      <div className="h-16 px-6 flex items-center justify-between max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => onNavigate?.('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-[#2E5BFF] rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C9.20435 2 8.44129 2.31607 7.87868 2.87868C7.31607 3.44129 7 4.20435 7 5C7 5.79565 7.31607 6.55871 7.87868 7.12132C8.44129 7.68393 9.20435 8 10 8C10.7956 8 11.5587 7.68393 12.1213 7.12132C12.6839 6.55871 13 5.79565 13 5C13 4.20435 12.6839 3.44129 12.1213 2.87868C11.5587 2.31607 10.7956 2 10 2ZM5 5C5 3.67392 5.52678 2.40215 6.46447 1.46447C7.40215 0.526784 8.67392 0 10 0C11.3261 0 12.5979 0.526784 13.5355 1.46447C14.4732 2.40215 15 3.67392 15 5C15 6.32608 14.4732 7.59785 13.5355 8.53553C12.5979 9.47322 11.3261 10 10 10C8.67392 10 7.40215 9.47322 6.46447 8.53553C5.52678 7.59785 5 6.32608 5 5Z" fill="white"/>
                <path d="M10 11C7.87827 11 5.84344 11.8429 4.34315 13.3431C2.84285 14.8434 2 16.8783 2 19C2 19.2652 2.10536 19.5196 2.29289 19.7071C2.48043 19.8946 2.73478 20 3 20C3.26522 20 3.51957 19.8946 3.70711 19.7071C3.89464 19.5196 4 19.2652 4 19C4 17.4087 4.63214 15.8826 5.75736 14.7574C6.88258 13.6321 8.4087 13 10 13C11.5913 13 13.1174 13.6321 14.2426 14.7574C15.3679 15.8826 16 17.4087 16 19C16 19.2652 16.1054 19.5196 16.2929 19.7071C16.4804 19.8946 16.7348 20 17 20C17.2652 20 17.5196 19.8946 17.7071 19.7071C17.8946 19.5196 18 19.2652 18 19C18 16.8783 17.1571 14.8434 15.6569 13.3431C14.1566 11.8429 12.1217 11 10 11Z" fill="white"/>
              </svg>
            </div>
            <span className="text-[#1E293B]">MilkBank</span>
          </button>

          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          onClick={() => crumb.href && onNavigate?.(crumb.href)}
                          className="cursor-pointer"
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-[#1E293B]">{user.name}</div>
              <div className="text-xs text-[#64748B]">{user.email}</div>
            </div>
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#2E5BFF] text-white">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="hover:bg-[#F1F5F9]"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
