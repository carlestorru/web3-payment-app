import Web3 from 'web3';
import { InjectedConnector } from '@web3-react/injected-connector';

export const connector = new InjectedConnector({
	supportedChainIds: [1, 3, 4, 5, 42, 1337],
});

export const getLibrary = (provider) => {
	const library = new Web3(provider);
	return library;
};
