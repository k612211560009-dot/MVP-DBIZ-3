import React, { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Sheet({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
export function SheetTrigger({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
export function SheetContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn('fixed inset-y-0 right-0 z-50 w-80 bg-white p-4 shadow-xl', className)} {...props} />
	);
}
export function SheetHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn('mb-2', className)} {...props} />;
}
export function SheetTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
	return <h3 className={cn('text-lg font-semibold', className)} {...props} />;
}
export function SheetDescription({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn('text-sm text-gray-600', className)} {...props} />;
}
export function SheetFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn('mt-4 flex justify-end gap-2', className)} {...props} />;
}


