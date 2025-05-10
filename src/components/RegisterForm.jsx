/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { uploadToIPFS } from "@/utils/uploadToIPFS";
import toast from 'react-hot-toast'

const RegisterForm = ({ contract, account, pemilikKontrak, onRegisterSuccess }) => {
  const [nomorSertifikat, setNomorSertifikat] = useState("");
  const [nib, setNib] = useState("");
  const [pemegangHak, setPemegangHak] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registeredData, setRegisteredData] = useState(null); // State baru untuk data terdaftar

  const handleRegister = async () => {
    if (!contract || !account) toast.error("Wallet belum terhubung");
    if (account.toLowerCase() !== pemilikKontrak?.toLowerCase())
      return toast.error("Wallet tidak memiliki otorisasi");
    if (!file || !nomorSertifikat || !nib || !pemegangHak)
      return toast.error("Isi semua data dan pilih file sertifikat");

    try {
      setLoading(true);
      toast.loading("Mengunggah sertifikat ke IPFS...", { id: "loading" });

      // Upload ke IPFS lewat backend
      const { cid, url } = await uploadToIPFS(file);
      console.log("CID:", cid);

      toast.loading("Mengirim data ke blockchain...", { id: "loading" });

      // Kirim ke blockchain
      const tx = await contract.methods
        .daftarSertifikat(
          nomorSertifikat.trim(),
          cid,
          nib.trim(),
          pemegangHak.trim()
        )
        .send({ from: account });

      toast.dismiss("loading");

      const txHash = tx.transactionHash;
      console.log("Tx Hash:", txHash);

      // Simpan data yang berhasil didaftarkan
      setRegisteredData({
        nomorSertifikat,
        nib,
        pemegangHak,
        cid,
        txHash,
      });
      toast.success("Sertifikat berhasil didaftarkan!");

      if (onRegisterSuccess) onRegisterSuccess();

      // Reset form
      setNomorSertifikat("");
      setNib("");
      setPemegangHak("");
      setFile(null);
    } catch (err) {
      console.error("Tx Error:", err);
      toast.dismiss("loading");
      try {
        const [nibSudah, sertifikatSudah] = await Promise.all([
          contract.methods.nibTerdaftar(nib.trim()).call(),
          contract.methods
            .verifikasiSertifikat(nomorSertifikat.trim())
            .call()
            .then((s) => s && s[0] !== "")
            .catch(() => false),
        ]);

        let pesan = "";
        if (nibSudah)
          pesan += "NIB ini sudah pernah terdaftar di blockchain!\n";
        if (sertifikatSudah)
          pesan +=
            "Nomor sertifikat ini sudah pernah terdaftar di blockchain!";

        if (pesan) return toast.error(pesan.trim());
      } catch (_) {}
      toast.error("Gagal mendaftarkan sertifikat karena alasan lain.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-4 p-6 rounded-xl shadow-lg bg-white h-fit">
      <h2 className="text-2xl font-bold text-[#012154]">Registrasi Sertifikat</h2>

      <input
        type="text"
        placeholder="Nomor Sertifikat"
        value={nomorSertifikat}
        onChange={(e) => setNomorSertifikat(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#012154]"
        disabled={loading}
      />

      <input
        type="text"
        placeholder="NIB"
        value={nib}
        onChange={(e) => setNib(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#012154]"
        disabled={loading}
      />

      <input
        type="text"
        placeholder="Pemegang Hak"
        value={pemegangHak}
        onChange={(e) => setPemegangHak(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#012154]"
        disabled={loading}
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept=".pdf"
        className="w-full border border-gray-300 px-4 py-2 rounded-md file:bg-[#012154] file:text-white file:border-none file:px-4 file:py-2 file:rounded-md"
        disabled={loading}
      />

      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full bg-[#012154] text-white font-medium px-6 py-3 rounded-full hover:bg-[#011a3f] disabled:opacity-50"
      >
        {loading ? "Mendaftarkan..." : "Daftarkan Sertifikat"}
      </button>

      {/* Tampilkan data yang berhasil didaftarkan */}
      {registeredData && (
        <div className="mt-6 p-4 rounded-lg bg-gray-100">
          <h3 className="text-lg font-semibold text-[#012154]">
            Data Sertifikat Terdaftar
          </h3>
          <p>
            <strong>Nomor Sertifikat:</strong> {registeredData.nomorSertifikat}
          </p>
          <p>
            <strong>NIB:</strong> {registeredData.nib}
          </p>
          <p>
            <strong>Pemegang Hak:</strong> {registeredData.pemegangHak}
          </p>
          <p>
            <strong>Link CID:</strong>{" "}
            <a
              href={`https://ipfs.io/ipfs/${registeredData.cid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#012154] underline"
            >
              {`https://ipfs.io/ipfs/${registeredData.cid}`}
            </a>
          </p>
          <p>
            <strong>Link Transaksi:</strong>{" "}
            <a
              href={`https://sepolia.basescan.org/tx/${registeredData.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#012154] underline"
            >
              {registeredData.txHash}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;