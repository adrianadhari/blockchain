import { useState } from "react";
import useBlockchain from "./hooks/useBlockchain";

function App() {
  const { contract, account, owner, connectWallet } = useBlockchain();
  const [landNumber, setLandNumber] = useState("");
  const [ipfsCID, setIpfsCID] = useState("");
  const [verifyLandNumber, setVerifyLandNumber] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);

  const registerCertificate = async () => {
    if (!contract || !account) {
      console.error("Wallet belum terhubung!");
      alert("Silakan hubungkan wallet terlebih dahulu.");
      return;
    }

    if (account.toLowerCase() !== owner?.toLowerCase()) {
      alert(
        "Wallet anda tidak memiliki otoriasasi."
      );
      return;
    }

    try {
      let existingCertificate;
      try {
        existingCertificate = await contract.methods
          .verifyCertificate(landNumber)
          .call();
      } catch (error) {
        console.warn("Sertifikat belum ada, bisa didaftarkan.", error);
      }

      // Jika existingCertificate bukan undefined/null dan memiliki data
      if (existingCertificate && existingCertificate[0] !== "") {
        alert("❌ Sertifikat ini sudah terdaftar di blockchain!");
        return;
      }

      const result = await contract.methods
        .registerCertificate(landNumber, ipfsCID)
        .send({ from: account });

      console.log("Transaksi sukses:", result);
      alert("Sertifikat berhasil didaftarkan!");
    } catch (error) {
      console.error("Gagal mendaftarkan sertifikat:", error);
    }
  };

  const verifyCertificate = async () => {
    if (!contract) {
      console.error("Kontrak belum terhubung!");
      return;
    }

    try {
      console.log("Mengecek Land Number:", landNumber);
      const result = await contract.methods
        .verifyCertificate(verifyLandNumber)
        .call();
      console.log("Hasil Query dari Smart Contract:", result);

      const landNumber2 = result[0];
      const ipfsCID2 = result[1];
      const timestampRaw = Number(result[2]);

      const timestamp2 = new Date(timestampRaw * 1000).toLocaleString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setVerificationResult({ landNumber2, ipfsCID2, timestamp2 });
    } catch (error) {
      console.error("Sertifikat tidak ditemukan:", error);
      setVerificationResult(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Blockchain Certificate Registration</h1>

      {/* Tombol Hubungkan Wallet */}
      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white p-2 my-4"
        >
          Hubungkan Wallet
        </button>
      ) : (
        <p>Connected Account: {account}</p>
      )}

      <div>
        <input
          type="text"
          placeholder="Land Number"
          value={landNumber}
          onChange={(e) => setLandNumber(e.target.value)}
          className="border p-2 my-2"
          required
        />
        <input
          type="text"
          placeholder="IPFS CID"
          value={ipfsCID}
          onChange={(e) => setIpfsCID(e.target.value)}
          className="border p-2 my-2"
          required
        />
        <button
          onClick={registerCertificate}
          className="bg-blue-500 text-white p-2"
        >
          Register Certificate
        </button>
      </div>

      <div>
        <div className="border p-4 my-4">
          <h2 className="text-lg font-semibold">Verifikasi Sertifikat</h2>
          <input
            type="text"
            placeholder="Masukkan Land Number"
            value={verifyLandNumber}
            onChange={(e) => setVerifyLandNumber(e.target.value)}
            className="border p-2 my-2"
            required
          />
          <button
            onClick={verifyCertificate}
            className="bg-green-500 text-white p-2"
          >
            Verify Certificate
          </button>

          {verificationResult ? (
            <div className="mt-4 p-2 border">
              <h3 className="font-semibold">Hasil Verifikasi:</h3>
              <p>
                <strong>Land Number:</strong> {verificationResult.landNumber2}
              </p>
              <p>
                <strong>IPFS CID:</strong> {verificationResult.ipfsCID2}
              </p>
              <p>
                <strong>Timestamp:</strong> {verificationResult.timestamp2}
              </p>
              <a
                href={`https://yellow-major-mouse-593.mypinata.cloud/ipfs/${verificationResult.ipfsCID2}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Lihat Sertifikat
              </a>
            </div>
          ) : (
            verifyLandNumber && (
              <p className="text-red-500">Sertifikat tidak ditemukan</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
