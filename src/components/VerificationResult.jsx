/* eslint-disable react/prop-types */
const VerificationResult = ({ result }) => {
    if (result?.error) {
      return <p className="text-red-500">Sertifikat tidak ditemukan.</p>;
    }
    return (
      <div className="mt-4 border rounded p-4 bg-gray-50">
        <p><strong>Nomor Sertifikat Tanah:</strong> {result.landNumber}</p>
        <p><strong>IPFS CID:</strong> {result.ipfsCID}</p>
        <p><strong>Waktu Pencatatan:</strong> {result.timestamp}</p>
        <a
          href={`https://ipfs.io/ipfs/${result.ipfsCID}`}
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