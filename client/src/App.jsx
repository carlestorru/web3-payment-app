import Routes from './routes';
import { SettingsProvider } from './context/SettingsContext';

function App() {
	return (
		<SettingsProvider>
			<Routes />
		</SettingsProvider>
	);
}

export default App;
