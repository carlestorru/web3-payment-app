import { createContext, useState, useContext } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
	const [settings, setSettings] = useState({
		readDB: true,
		darkMode: false,
	});

	const toggleDataDB = () => {
		setSettings((prev) => {
			return { ...prev, readDB: !prev.readDB };
		});
	};

	const toggleDarkMode = () => {
		if (settings.darkMode) {
			document.documentElement.classList.remove('dark');
		} else {
			document.documentElement.classList.add('dark');
		}
		localStorage.setItem('darkMode', !settings.darkMode);
		setSettings((prev) => {
			return { ...prev, darkMode: !prev.darkMode };
		});
	};

	const checkIfDarkMode = () => {
		const isDarkMode = localStorage.getItem('darkMode') === 'true';
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
		setSettings(prev => {
			return { ...prev, darkMode: isDarkMode}
		})
	};

	return (
		<SettingsContext.Provider value={[settings, toggleDataDB, toggleDarkMode, checkIfDarkMode]}>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings() {
	const context = useContext(SettingsContext);
	return context;
}
