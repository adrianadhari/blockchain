import { useState } from "react";
import { getContract, getWeb3 } from "../contract";
import toast from 'react-hot-toast'

const useBlockchain = () => {
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [pemilikKontrak, setPemilikKontrak] = useState(null); const connectWallet = async () => {
        try {
            const web3 = await getWeb3();
            if (!web3) return;

            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            if (accounts.length > 0) {
                setAccount(accounts[0]);

                const contractInstance = await getContract();
                setContract(contractInstance);

                const contractPemilik = await contractInstance.methods.pemilikKontrak().call();
                setPemilikKontrak(contractPemilik);
            }
        } catch (err) {
            return toast.error("Gagal menghubungkan wallet. Pastikan MetaMask terinstal.", err);
        }

    }; return { contract, account, pemilikKontrak, connectWallet };
}; export default useBlockchain;

