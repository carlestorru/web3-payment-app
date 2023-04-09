import { createContext, useState, useContext } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
	const [settings, setSettings] = useState({
        readDB: true
    });

	return (
		<SettingsContext.Provider value={[settings, setSettings]}>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings() {
	const context = useContext(SettingsContext);
	return context;
}
