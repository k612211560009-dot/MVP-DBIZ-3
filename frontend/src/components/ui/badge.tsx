import React, { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type Variant = 'default' | 'secondary' | 'outline' | 'destructive';

export function Badge({
	className,
	variant = 'default',
	...props
}: HTMLAttributes<HTMLDivElement> & { variant?: Variant }) {
	const variants: Record<Variant, string> = {
		default: 'bg-blue-600 text-white',
		secondary: 'bg-gray-200 text-gray-800',
		outline: 'border border-gray-300 text-gray-700',
		destructive: 'bg-red-600 text-white',
	};
	return (
		<div
			className={cn(
				'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
				variants[variant],
				className
			)}
			{...props}
		/>
	);
}


