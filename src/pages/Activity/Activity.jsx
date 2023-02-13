import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Activity = () => {
	useAuth();
	useDocumentTitle('Activity');

	return <h2>Activity</h2>;
};

export default Activity;
