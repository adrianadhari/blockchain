/* eslint-disable react/prop-types */
import { useState } from "react";
import { uploadToIPFS } from "@/utils/uploadToIPFS";

const RegisterForm = ({ contract, account, pemilikKontrak }) => {
  const [nomorSertifikat, setNomorSertifikat] = useState("");
  const [nib, setNib] = useState("");
  const [pemegangHak, setPemegangHak] = useState("");
  const [file, setFile] = useState(null);
  const [ipfsUrl, setIpfsUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!contract || !account) return alert("Wallet belum terhubung");
    if (account.toLowerCase() !== pemilikKontrak?.toLowerCase())
      return alert("Wallet tidak memiliki otorisasi");
    if (!file || !nomorSertifikat || !nib || !pemegangHak)
      return alert("Isi semua data dan pilih file sertifikat");

    try {
      setLoading(true);

      // Upload ke IPFS lewat backend
      const { cid, url } = await uploadToIPFS(file);
      console.log("CID:", cid);

      // Kirim ke blockchain
      await contract.methods
        .daftarSertifikat(
          nomorSertifikat.trim(),
          cid,
          nib.trim(),
          pemegangHak.trim()
        )
        .send({ from: account });

      setIpfsUrl(url);
      alert("✅ Sertifikat berhasil didaftarkan!");

      // Reset form
      setNomorSertifikat("");
      setNib("");
      setPemegangHak("");
      setFile(null);
    } catch (err) {
      console.error("Tx Error:", err);
      try {
        const existing = await contract.methods
          .verifikasiSertifikat(nomorSertifikat.trim())
          .call();

        if (existing && existing[0] !== "") {
          alert("❌ Sertifikat ini sudah terdaftar di blockchain!");
        } else {
          alert("⚠️ Gagal mendaftarkan sertifikat karena alasan lain.");
        }
      } catch (innerErr) {
        console.error("Verifikasi error:", innerErr);
        alert("Gagal memverifikasi status sertifikat.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 border p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold">Registrasi Sertifikat</h2>

      <input
        type="text"
        placeholder="Nomor Sertifikat"
        value={nomorSertifikat}
        onChange={(e) => setNomorSertifikat(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 rounded-md"
      />

      <input
        type="text"
        placeholder="NIB"
        value={nib}
        onChange={(e) => setNib(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 rounded-md"
      />

      <input
        type="text"
        placeholder="Pemegang Hak"
        value={pemegangHak}
        onChange={(e) => setPemegangHak(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 rounded-md"
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept=".pdf,.png,.jpg"
        className="w-full border border-gray-300 px-3 py-2 rounded-md file:bg-blue-600 file:text-white file:border-none file:px-4 file:py-2"
      />

      <button
        onClick={handleRegister}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Mendaftarkan..." : "Daftarkan Sertifikat"}
      </button>

      {ipfsUrl && (
        <p className="text-sm mt-2">
          Sertifikat IPFS:{" "}
          <a
            href={ipfsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {ipfsUrl}
          </a>
        </p>
      )}
    </div>
  );
};

export default RegisterForm;
