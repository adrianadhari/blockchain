import { MdOutlineSearch } from "react-icons/md";

const Fe = () => {
  return (
    <div
      className="w-full min-h-screen bg-no-repeat relative"
      style={{ backgroundImage: `url('/bg-spiral.svg')` }}
    >
      <div className="w-52 h-52 bg-[#0e54c4] absolute top-80 left-14 z-10 blur-2xl rounded-full opacity-30 overflow-hidden"></div>
      <div className="w-72 h-72 bg-[#ecad0d] absolute bottom-40 left-[750px] z-10 blur-2xl rounded-full opacity-30 overflow-hidden"></div>
      <div className="w-56 h-56 bg-[#0e54c4] absolute bottom-12 right-48 z-10 blur-2xl rounded-full opacity-30 overflow-hidden"></div>
      <div className="w-40 h-40 bg-[#ecad0d] absolute top-32 right-96 z-10 blur-2xl rounded-full opacity-30 overflow-hidden"></div>
      <div className="container mx-auto flex items-center justify-between px-40 py-5">
        <a href="#" className="text-[#012154] font-bold text-3xl">
          Sertifikat <span className="text-[#ecad0d]">EL</span>
        </a>
        <div className="p-3 bg-[#012154] hover:opacity-90 rounded-full">
        <MdOutlineSearch className="text-white text-2xl"/>
        </div>
      </div>

      <div className="container mx-auto px-40 flex items-center mt-56 justify-between">
        <div className="space-y-7 max-w-xl">
          <p className="font-bold text-5xl leading-snug text-[#012154]"><span className="text-[#ecad0d]">Solusi Digital</span> untuk Sertifikat Tanah <span className="text-[#ecad0d]">Anda</span></p>
          <p className="text-lg">Platform digital yang memudahkan verifikasi, dan pengunduhan sertifikat tanah. Membantu masyarakat dalam memastikan keabsahan dokumen sertifikat tanah secara efisien.</p>
          <button className="bg-[#012154] text-white font-medium px-8 py-4 rounded-full"><MdOutlineSearch className="text-white inline text-2xl"/> Verifikasi Sertifikat</button>
        </div>
        <div>
          <img src="/vector.svg" alt="vector" />
        </div>
      </div>
    </div>
  );
};

export default Fe;
