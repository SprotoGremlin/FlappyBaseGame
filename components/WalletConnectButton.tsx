'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="flex flex-col items-center gap-4">
      {isConnected ? (
        <div className="text-center">
          <p className="text-sm text-gray-400">Connected</p>
          <p className="font-mono text-xs text-[#F9D71C]">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
          <button
            onClick={() => disconnect()}
            className="mt-3 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-medium transition"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={() => connect({ connector: coinbaseWallet() })}
          className="px-8 py-3 bg-[#0052FF] hover:bg-[#0040cc] rounded-2xl font-semibold text-white flex items-center gap-2 transition"
        >
          <span>Connect Wallet</span>
          <span className="text-xl">→</span>
        </button>
      )}
    </div>
  );
}
