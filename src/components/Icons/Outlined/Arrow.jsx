export function ArrowDown() {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={1.5}
			stroke='currentColor'
			className='h-4 w-4'>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3'
			/>
		</svg>
	);
}

export function ArrowUp() {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={1.5}
			stroke='currentColor'
			className='h-4 w-4'>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18'
			/>
		</svg>
	);
}

export function ArrowUpRight() {
	return (
		<svg
			fill='none'
			stroke='currentColor'
			strokeWidth={1.5}
			viewBox='0 0 24 24'
			xmlns='http://www.w3.org/2000/svg'
			aria-hidden='true'>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25'
			/>
		</svg>
	);
}

export function ArrowDownLeft() {
	return (
		<svg
			fill='none'
			stroke='currentColor'
			strokeWidth={1.5}
			viewBox='0 0 24 24'
			xmlns='http://www.w3.org/2000/svg'
			aria-hidden='true'>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25'
			/>
		</svg>
	);
}

export function ArrowDownTray({className}) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={1.5}
			stroke='currentColor'
			className={`h-6 w-6 ${className}`}>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3'
			/>
		</svg>
	);
}
