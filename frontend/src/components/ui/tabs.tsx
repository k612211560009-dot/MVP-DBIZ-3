import React, { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Tabs({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}
export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn('flex gap-2 border-b', className)} {...props} />;
}
export function TabsTrigger({ className, ...props }: HTMLAttributes<HTMLButtonElement>) {
	return <button className={cn('px-3 py-2 text-sm hover:bg-gray-100 rounded', className)} {...props} />;
}
export function TabsContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn('py-3', className)} {...props} />;
}


