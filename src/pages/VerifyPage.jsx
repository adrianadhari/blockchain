import useBlockchain from "@/hooks/useBlockchain";
import VerifyForm from "@/components/VerifyForm";
import { useEffect } from "react";

const VerifyPage = () => {
  const { contract } = useBlockchain();
  useEffect(() => {
    console.log("Contract di verify:", contract);
  }, [contract]);
  

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Verifikasi Sertifikat</h1>
      <VerifyForm contract={contract} />
    </div>
  );
};

export default VerifyPage;
