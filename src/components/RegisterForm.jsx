/* eslint-disable react/prop-types */
import { useState } from "react";
import { uploadToIPFS } from "@/utils/uploadToIPFS"; // Update untuk pakai upload ke Express backend

const RegisterForm = ({ contract, account, owner }) => {
  const [landNumber, setLandNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [ipfsUrl, setIpfsUrl] = useState("");

  const handleRegister = async () => {
    if (!contract || !account) return alert("Wallet belum terhubung");
    if (account.toLowerCase() !== owner?.toLowerCase())
      return alert("Wallet tidak memiliki otorisasi");
    if (!file) return alert("Pilih file sertifikat terlebih dahulu");

    const cleanLandNumber = landNumber.trim().replace(/[`'"]/g, "");

    try {
      setLoading(true);

      // 1. Upload file ke backend Express (dan IPFS)
      const { cid, url } = await uploadToIPFS(file); // Panggil function uploadToIPFS ke backend Express
      console.log("CID:", cid);

      // 2. Simpan CID ke blockchain
      await contract.methods
        .registerCertificate(cleanLandNumber, cid)
        .send({ from: account });

      setIpfsUrl(url); // Set URL IPFS yang bisa diakses
      alert("✅ Sertifikat berhasil didaftarkan!");
      setLandNumber("");
      setFile(null);
    } catch (err) {
      console.error("Tx Error:", err);

      try {
        const existing = await contract.methods
          .verifyCertificate(cleanLandNumber)
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
        placeholder="Nomor Tanah"
        value={landNumber}
        onChange={(e) => setLandNumber(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          CID IPFS:{" "}
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
