import { Button } from '../components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Đã xảy ra lỗi',
  message = 'Không thể tải dữ liệu. Vui lòng thử lại.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-6">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h3 className="mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        {message}
      </p>
      {onRetry && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Tải lại trang
          </Button>
          <Button onClick={onRetry}>Thử lại</Button>
        </div>
      )}
    </div>
  );
}
