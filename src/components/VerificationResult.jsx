/* eslint-disable react/prop-types */
const VerificationResult = ({ result }) => {
    if (result?.error) {
      return <p className="text-red-500">Sertifikat tidak ditemukan.</p>;
    }
    return (
      <div className="mt-4 border rounded p-4 bg-gray-50">
        <p><strong>Nomor Sertifikat Tanah:</strong> {result.nomorSertifikat}</p>
        <p><strong>IPFS CID:</strong> {result.cidIpfs}</p>
        <p><strong>NIB:</strong> {result.nib}</p>
        <p><strong>Pemegang Hak:</strong> {result.pemegangHak}</p>
        <p><strong>Waktu Pencatatan:</strong> {result.waktuTerdaftar}</p>
        <a
          href={`https://ipfs.io/ipfs/${result.cidIpfs}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Lihat Sertifikat
        </a>
      </div>
    );
  };
  
  export default VerificationResult;