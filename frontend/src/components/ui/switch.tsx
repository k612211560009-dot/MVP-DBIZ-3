import React from 'react';

type SwitchProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Switch(props: SwitchProps) {
	return <input type="checkbox" role="switch" {...props} />;
}


