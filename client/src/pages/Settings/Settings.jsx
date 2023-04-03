import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';

function Settings() {
	useAuth();
	useDocumentTitle('Settings');

	return <h2>Settings</h2>;
}

export default Settings;
