import { useState, useEffect, useCallback } from "react";
import useBlockchain from "../hooks/useBlockchain"; // Hook untuk mengelola koneksi blockchain
import RegisterForm from "../components/RegisterForm"; // Komponen form registrasi
import metamaskLogo from "../assets/metamask-logo.png"; // Path ke logo MetaMask
import { getContract, getWeb3 } from "../contract";
import toast from 'react-hot-toast'

function BPNPage() {
  const { contract, account, pemilikKontrak, connectWallet } = useBlockchain();
  const [isConnecting, setIsConnecting] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const handleConnectWallet = async () => {
    setIsConnecting(true); // Mulai animasi loading
    try {
      await connectWallet(); // Memanggil fungsi untuk menghubungkan wallet
    } catch (error) {
      console.error("Gagal menghubungkan wallet:", error);
      return toast.error("Gagal menghubungkan wallet. Pastikan MetaMask terinstal.");
    } finally {
      setIsConnecting(false); // Hentikan animasi loading
    }
  };

  // Fungsi untuk mengambil transaksi
  const fetchTransactions = useCallback(async () => {
    if (!contract) return; // Tunggu sampai kontrak tersedia
    setLoading(true);
    try {
      // Ambil instance web3
      const web3 = await getWeb3(false); // Mode read-only
      if (!web3) throw new Error("Gagal menginisialisasi Web3");

      // Ambil instance kontrak
      const contractInstance = await getContract(false);
      if (!contractInstance) throw new Error("Gagal menginisialisasi kontrak");

      console.log(
        "Kontrak berhasil diinisialisasi:",
        contractInstance._address
      );

      // Ambil semua event
      console.log("Mengambil event SertifikatTerdaftar...");
      const events = await contractInstance.getPastEvents(
        "SertifikatTerdaftar",
        {
          fromBlock: 0,
          toBlock: "latest",
        }
      );
      console.log("Jumlah event ditemukan:", events.length);

      // Proses semua event dan urutkan berdasarkan timestamp (terbaru dulu)
      const allTxs = events
        .map((event) => ({
          nomorSertifikat: event.returnValues.nomorSertifikat,
          cidIpfs: event.returnValues.cidIpfs,
          nib: event.returnValues.nib,
          pemegangHak: event.returnValues.pemegangHak,
          waktuTerdaftar: new Date(
            Number(event.returnValues.waktuTerdaftar) * 1000
          ).toLocaleString("id-ID"),
          timestamp: Number(event.returnValues.waktuTerdaftar),
          txHash: event.transactionHash,
        }))
        .sort((a, b) => b.timestamp - a.timestamp);
      console.log("Semua transaksi:", allTxs);

      setTransactions(allTxs);
    } catch (error) {
      console.error("Gagal mengambil transaksi:", error.message, error.stack);
      toast.error("Gagal memuat data transaksi: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // Ambil transaksi saat kontrak tersedia
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, contract]);

  // Callback untuk memperbarui tabel setelah pendaftaran
  const onRegisterSuccess = () => {
    fetchTransactions();
  };

  // Logika pagination
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = transactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex flex-col items-center bg-slate-100 justify-center min-h-screen w-full">
      {!account ? (
        <div>
          <h1 className="text-2xl text-center font-bold text-[#012154] mb-6">
            Hubungkan Wallet
          </h1>
          <button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="mx-auto block bg-slate-200 shadow-lg text-white font-medium p-7 rounded-full hover:scale-125 disabled:opacity-50 transition-all duration-300 cursor-pointer"
          >
            {isConnecting ? (
              <span className="flex items-center text-[#012154]">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                  />
                </svg>
                Menghubungkan Wallet...
              </span>
            ) : (
              <img
                src={metamaskLogo}
                alt="MetaMask"
                className="w-20"
              />
            )}
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white px-8 py-2 rounded-lg shadow mb-5">
            <p className="text-sm font-bold text-gray-600">
              Address Wallet Anda: {account}
            </p>
          </div>
          <div className="flex mx-auto w-full justify-between px-20 space-x-10">
            <RegisterForm
              contract={contract}
              account={account}
              pemilikKontrak={pemilikKontrak}
              onRegisterSuccess={onRegisterSuccess}
            />
            <div className="w-fit md:w-3xl lg:min-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg">
              <h1 className="text-3xl font-bold text-[#012154] mb-6">
                Riwayat Pendaftaran Sertifikat
              </h1>
              {loading ? (
                <p className="text-gray-600">Memuat data...</p>
              ) : transactions.length === 0 ? (
                <p className="text-gray-600">Belum ada transaksi.</p>
              ) : (
                <>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#012154] text-white">
                        <th className="p-3 text-left">Nomor Sertifikat</th>
                        <th className="p-3 text-left">NIB</th>
                        <th className="p-3 text-left">Pemegang Hak</th>
                        <th className="p-3 text-left">Waktu</th>
                        <th className="p-3 text-left">Link Transaksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((tx, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3">{tx.nomorSertifikat}</td>
                          <td className="p-3">{tx.nib}</td>
                          <td className="p-3">{tx.pemegangHak}</td>
                          <td className="p-3">{tx.waktuTerdaftar}</td>
                          <td className="p-3">
                            <a
                              href={`https://sepolia.basescan.org/tx/${tx.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#012154] underline"
                            >
                              Lihat Transaksi
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-between mt-6">
                    <button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className="bg-[#012154] text-white px-4 py-2 rounded-full disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <p>
                      Halaman {currentPage} dari {totalPages}
                    </p>
                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className="bg-[#012154] text-white px-4 py-2 rounded-full disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BPNPage;
