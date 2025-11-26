import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LucideIcon } from 'lucide-react';
import { Badge } from './ui/badge';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  subtitle?: string;
}

export function KPICard({ title, value, icon: Icon, trend, subtitle }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="tracking-tight">{value}</div>
          {trend && (
            <Badge variant={trend.direction === 'up' ? 'default' : 'secondary'}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
            </Badge>
          )}
        </div>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
