import React, { createContext, useContext, useState, HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const SidebarContext = createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(true);
	return <SidebarContext.Provider value={{ open, setOpen }}>{children}</SidebarContext.Provider>;
}

export function SidebarTrigger() {
	const ctx = useContext(SidebarContext);
	if (!ctx) return null;
	return (
		<button
			className="rounded border px-2 py-1 text-sm hover:bg-gray-50"
			onClick={() => ctx.setOpen(!ctx.open)}
		>
			Menu
		</button>
	);
}

export function Sidebar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <aside className={cn('hidden w-64 shrink-0 border-r bg-white md:block', className)} {...props} />;
}
export function SidebarHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn('', className)} {...props} />;
}
export function SidebarFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn('', className)} {...props} />;
}
export function SidebarContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn('p-2', className)} {...props} />;
}
export function SidebarGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn('mb-4', className)} {...props} />;
}
export function SidebarGroupLabel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn('px-2 py-1 text-xs font-semibold uppercase text-gray-500', className)} {...props} />;
}
export function SidebarGroupContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn('', className)} {...props} />;
}
export function SidebarMenu({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
	return <ul className={cn('space-y-1', className)} {...props} />;
}
export function SidebarMenuItem({ className, ...props }: HTMLAttributes<HTMLLIElement>) {
	return <li className={cn('', className)} {...props} />;
}
export function SidebarMenuButton({
	className,
	isActive,
	asChild,
	...props
}: HTMLAttributes<HTMLButtonElement> & { isActive?: boolean; asChild?: boolean }) {
	const classes = cn(
		'flex w-full items-center gap-2 rounded px-2 py-2 text-sm hover:bg-gray-100',
		isActive ? 'bg-gray-100 font-medium' : 'text-gray-700',
		className
	);
	if (asChild) {
		return <span className={classes} {...(props as any)} />;
	}
	return <button className={classes} {...props} />;
}


