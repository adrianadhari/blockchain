import { useEffect, useState } from "react";
import VerificationResult from "./VerificationResult";
import { getContract } from "../contract";

const VerifyForm = () => {
  const [contract, setContract] = useState(null);
  const [verifyLandNumber, setVerifyLandNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initContract = async () => {
      const c = await getContract(false); // mode publik tanpa wallet
      setContract(c);
    };
    initContract();
  }, []);

  const handleVerify = async () => {
    if (!contract) return;

    setResult(null);
    try {
      setLoading(true);
      const trimmed = verifyLandNumber.trim();
      const res = await contract.methods.verifyCertificate(trimmed).call();
      const data = {
        landNumber: res[0],
        ipfsCID: res[1],
        timestamp: new Date(Number(res[2]) * 1000).toLocaleString("id-ID"),
      };
      setResult(data);
    } catch (err) {
      console.error("Verification error:", err);
      setResult({ error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 border p-4 rounded-xl shadow mt-6">
      <h2 className="text-lg font-semibold">Verifikasi Sertifikat</h2>
      <input
        type="text"
        placeholder="Masukkan Nomor Tanah"
        value={verifyLandNumber}
        onChange={(e) => setVerifyLandNumber(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleVerify}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Memverifikasi..." : "Verifikasi"}
      </button>
      {result && <VerificationResult result={result} />}
    </div>
  );
};

export default VerifyForm;
