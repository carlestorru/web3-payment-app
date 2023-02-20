import { createContext, useState, useContext } from 'react';

const LayoutModeContext = createContext();

export function LayoutModeProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSideBar = () => {
        setIsOpen(prevOpen => !prevOpen);
    }

	return <LayoutModeContext.Provider value={[isOpen, toggleSideBar]}>
        {children}
    </LayoutModeContext.Provider>;
}

export function useLayoutMode () {
    const context = useContext(LayoutModeContext);
    return context;
}