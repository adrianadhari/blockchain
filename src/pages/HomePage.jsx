import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">
        Sistem Verifikasi Sertifikat Tanah
      </h1>
      <p className="mb-6 text-gray-600">Silakan pilih jenis layanan:</p>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/verify")}
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50"
        >
          Verifikasi Sertifikat
        </button>
        <button
          onClick={() => navigate("/register")}
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50"
        >
          Pendaftaran Sertifikat (BPN)
        </button>
      </div>
    </div>
  );
};

export default HomePage;
