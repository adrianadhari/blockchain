import Web3 from "web3";

export const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "nomorSertifikat",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "cidIpfs",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "nib",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "pemegangHak",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "waktuTerdaftar",
          "type": "uint256"
        }
      ],
      "name": "SertifikatTerdaftar",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_nomorSertifikat",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_cidIpfs",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_nib",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_pemegangHak",
          "type": "string"
        }
      ],
      "name": "daftarSertifikat",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "dataSertifikat",
      "outputs": [
        {
          "internalType": "string",
          "name": "nomorSertifikat",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "cidIpfs",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "nib",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "pemegangHak",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "waktuTerdaftar",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "nibTerdaftar",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pemilikKontrak",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_nomorSertifikat",
          "type": "string"
        }
      ],
      "name": "verifikasiSertifikat",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

export const contractAddress = "0x72c130b2f16584dAd6732F76323Da45e5Bc55ed5";

export const getWeb3 = async (withWallet = true) => {
  if (withWallet && window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      return web3;
    } catch (error) {
      console.error("Akses MetaMask ditolak:", error);
      return null;
    }
  } else {
    // Read-only mode (tanpa MetaMask)
    return new Web3("https://base-sepolia.g.alchemy.com/v2/jnSBPTY-5_1aknJmqCTz2YYRn4xqyKfX"); // public RPC Base Sepolia
  }
};

export const getContract = async (withWallet = true) => {
  const web3 = await getWeb3(withWallet);
  if (!web3) return null;

  return new web3.eth.Contract(contractABI, contractAddress);
};