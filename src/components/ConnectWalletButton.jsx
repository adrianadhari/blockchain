// eslint-disable-next-line react/prop-types
const ConnectWalletButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 w-full my-4"
  >
    Hubungkan Wallet
  </button>
);

export default ConnectWalletButton;
