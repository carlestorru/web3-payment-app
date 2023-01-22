import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

export function Wallet() {
    const { chainId, account, library } = useWeb3React();
    const [balance, setBalance] = useState('');

    const web3 = library;
    
    useEffect(() => {
        web3.eth.getBalance(account).then((result) => setBalance(web3.utils.fromWei(result)));
    }, [account, web3])

    return (
        <div>
            <p>Chain Id: {chainId}</p>
            <p>Account: {account}</p>
            <p>Balance: {balance}</p>
        </div>
    )
}