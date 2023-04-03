import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useParams } from 'react-router-dom';

function Pay() {
	useAuth();
	useDocumentTitle('Pay');

	const params = useParams();

	return (
		<>
			<h1>Pago</h1>
			<div>{JSON.stringify(params)}</div>
		</>
	);
}

export default Pay;
