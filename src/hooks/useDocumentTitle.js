import { useEffect } from 'react';

const TITLE = 'Web3 Payment App';

export default function useDocumentTitle(title) {
	useEffect(() => {
		document.title = TITLE + ' - ' + title;
	}, []);
}
