import useBlockchain from "../hooks/useBlockchain";
import ConnectWalletButton from "../components/ConnectWalletButton";
import RegisterForm from "../components/RegisterForm";

function RegisterPage() {
  const { contract, account, pemilikKontrak, connectWallet } = useBlockchain();

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Pendaftaran Sertifikat - BPN</h1>
      {!account ? (
        <ConnectWalletButton onClick={connectWallet} />
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-4">Akun terhubung: {account}</p>
          <RegisterForm contract={contract} account={account} pemilikKontrak={pemilikKontrak} />
        </>
      )}
    </div>
  );
}

export default RegisterPage;
