import React, { HTMLAttributes } from 'react';

export function DropdownMenu({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}
export function DropdownMenuTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
	return <>{children}</>;
}
export function DropdownMenuContent({
	children,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div {...props} className="z-50 rounded-md border bg-white p-2 shadow-md" >
			{children}
		</div>
	);
}
export function DropdownMenuItem({
	children,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className="cursor-pointer rounded px-2 py-1.5 hover:bg-gray-100" {...props}>
			{children}
		</div>
	);
}


