// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { getContract } from "../contract";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [contract, setContract] = useState(null);
  const [certNo, setCertNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Inisialisasi kontrak read-only
  useEffect(() => {
    (async () => {
      const c = await getContract(false);
      setContract(c);
    })();
  }, []);

  const handleVerify = async () => {
    setError("");
    setResult(null);
    if (!certNo.trim()) {
      setError("Masukkan nomor sertifikat");
      return;
    }
    setLoading(true);
    try {
      const res = await contract.methods
        .verifikasiSertifikat(certNo.trim())
        .call();

      // Cari event SertifikatTerdaftar berdasarkan nomorSertifikat
      const events = await contract.getPastEvents("SertifikatTerdaftar", {
        filter: { nomorSertifikat: certNo.trim() },
        fromBlock: 0,
        toBlock: "latest",
      });

      let txHash = "";
      if (events.length > 0) {
        txHash = events[0].transactionHash; // Ambil hash transaksi dari event pertama yang cocok
      } else {
        console.warn("Transaksi tidak ditemukan di event log");
      }

      setResult({
        nomorSertifikat: res[0],
        cid: res[1],
        nib: res[2],
        pemegangHak: res[3],
        waktu: new Date(Number(res[4]) * 1000).toLocaleString("id-ID"),
        txHash: txHash || "Tidak tersedia",
      });
    } catch {
      setError("Sertifikat tidak ditemukan");
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setShowModal(false);
    setCertNo("");
    setResult(null);
    setError("");
  };

  return (
    <div
      className="w-full min-h-screen bg-no-repeat relative"
      style={{ backgroundImage: `url('/bg-spiral.svg')` }}
    >
      {/* circle decorations */}
      <div className="w-52 h-52 bg-[#0e54c4] absolute top-80 left-14 z-10 blur-2xl rounded-full opacity-30" />
      <div className="w-72 h-72 bg-[#ecad0d] absolute bottom-40 left-[750px] z-10 blur-2xl rounded-full opacity-30" />
      <div className="w-56 h-56 bg-[#0e54c4] absolute bottom-12 right-48 z-10 blur-2xl rounded-full opacity-30" />
      <div className="w-40 h-40 bg-[#ecad0d] absolute top-32 right-96 z-10 blur-2xl rounded-full opacity-30" />

      {/* navbar */}
      <div className="container mx-auto flex items-center justify-between px-40 py-5">
        <div className="text-[#012154] font-bold text-3xl">
          Sertifikat <span className="text-[#ecad0d]">EL</span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="p-3 bg-[#012154] hover:opacity-90 rounded-full hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <MdOutlineSearch className="text-white text-2xl" />
        </button>
      </div>

      {/* hero */}
      <div className="container mx-auto px-40 flex items-center mt-56 justify-between">
        <div className="space-y-7 max-w-xl">
          <h1 className="font-bold text-5xl leading-snug text-[#012154]">
            <span className="text-[#ecad0d]">Solusi Digital</span> untuk
            Sertifikat Tanah <span className="text-[#ecad0d]">Anda</span>
          </h1>
          <p className="text-lg text-gray-700">
            Platform digital yang memudahkan verifikasi, dan pengunduhan
            sertifikat tanah. Membantu masyarakat dalam memastikan keabsahan
            dokumen sertifikat tanah secara efisien.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#012154] text-white cursor-pointer hover:scale-105 transition-all duration-300 font-medium px-8 py-4 rounded-full inline-flex items-center gap-2"
          >
            <MdOutlineSearch className="text-2xl" />
            Verifikasi Sertifikat
          </button>
        </div>
        <div>
          <img src="/vector.svg" alt="vector" />
        </div>
      </div>

      {/* modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={close}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Verifikasi Sertifikat
            </h2>

            {/* input & button */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Masukkan Nomor Sertifikat"
                value={certNo}
                onChange={(e) => setCertNo(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full bg-[#012154] text-white px-4 py-2 rounded-md hover:scale-105 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Memverifikasi..." : "Verifikasi"}
              </button>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            {/* hasil */}
            {result && (
              <div className="mt-6 space-y-3">
                <p>
                  <strong>Nomor:</strong> {result.nomorSertifikat}
                </p>
                <p>
                  <strong>NIB:</strong> {result.nib}
                </p>
                <p>
                  <strong>Pemegang Hak:</strong> {result.pemegangHak}
                </p>
                <p>
                  <strong>Waktu:</strong> {result.waktu}
                </p>
                <p>
                  IPFS:{" "}
                  <a
                    href={`https://ipfs.io/ipfs/${result.cid}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://ipfs.io/ipfs/{result.cid}
                  </a>
                </p>
                {result.txHash && (
                  <p>
                    <strong>Transaksi:</strong>{" "}
                    {result.txHash === "Tidak tersedia" ? (
                      result.txHash
                    ) : (
                      <a
                        href={`https://sepolia.basescan.org/tx/${result.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {result.txHash}
                      </a>
                    )}
                  </p>
                )}
                {/* preview file */}
                <div className="mt-4">
                  <iframe
                    src={`https://ipfs.io/ipfs/${result.cid}`}
                    className="w-full h-[500px] border"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
