import { createContext, useState, useContext } from 'react';

const BalanceContext = createContext();

export function BalanceProvider({ children }) {
	const [balance, setBalance] = useState('');

	const updateUserBalance = (account, web3) => {
		web3.eth
			.getBalance(account)
			.then((result) => {
                setBalance(web3.utils.fromWei(result))
            });
	};

	return (
		<BalanceContext.Provider value={[balance, updateUserBalance]}>
			{children}
		</BalanceContext.Provider>
	);
}

export function useBalance() {
	const context = useContext(BalanceContext);
	return context;
}
