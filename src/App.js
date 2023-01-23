import './App.css';
import { useEffect, useCallback } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'; 
import { connector } from './config/web3'
import { NoEthereumProviderError, UserRejectedRequestError } from '@web3-react/injected-connector';

import { Wallet } from './components/Wallet';

function App() {
  const { activate, active, deactivate, error } = useWeb3React();

  const connect = useCallback(() => {
    activate(connector);
    localStorage.setItem('previouslyConnected', true);
  }, [activate]);

  useEffect(() => {
    if (localStorage.getItem('previouslyConnected') === 'true') {
      connect()
    }
  }, [connect]);

  const disconnect = () => {
    deactivate();
    localStorage.removeItem('previouslyConnected');
  };

  const isNoEthereumProviderError = error instanceof NoEthereumProviderError;
  const isUserRejectedRequestError = error instanceof UserRejectedRequestError;
  const isUnsupportedChainIdError  = error instanceof UnsupportedChainIdError;
  console.log(isNoEthereumProviderError);
  console.log(isUserRejectedRequestError);
  console.log(isUnsupportedChainIdError );

  return (
    <main>
      {
        active 
        ? <>
            <button onClick={disconnect}>Desconectar Wallet</button>
            <Wallet />
          </>
        : <button onClick={connect}>Conectar wallet</button>
      }
    </main>
  );
}

export default App;
