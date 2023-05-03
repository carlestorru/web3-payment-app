import Routes from './routes';
import { SettingsProvider } from './context/SettingsContext';
import { BalanceProvider } from './context/BalanceContext';

function App() {
	return (
		<SettingsProvider>
			<BalanceProvider>
				<Routes />
			</BalanceProvider>
		</SettingsProvider>
	);
}

export default App;
