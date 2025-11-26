import React from 'react';
import { cn } from '../../lib/utils';

export function Avatar({ className, children }: { className?: string; children?: React.ReactNode }) {
	return <div className={cn('inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-200', className)}>{children}</div>;
}
export function AvatarFallback({ children }: { children?: React.ReactNode }) {
	return <span className="text-sm font-medium text-gray-600">{children}</span>;
}


