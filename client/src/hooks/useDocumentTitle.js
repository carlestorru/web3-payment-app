import { useEffect } from 'react';

const TITLE = '3Pay';

export default function useDocumentTitle(title) {
	useEffect(() => {
		document.title = TITLE + ' - ' + title;
	}, []);
}
