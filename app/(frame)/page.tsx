import FlappyBirdGame from '@/components/FlappyBirdGame';
import { WalletConnectButton } from '@/components/WalletConnectButton';

export default function FlappyFrame() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] py-8 px-4 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-7xl font-black tracking-tighter mb-3 bg-gradient-to-r from-[#F9D71C] via-[#633BBC] to-[#0052FF] bg-clip-text text-transparent">
          FlappyBase
        </h1>
        <p className="text-xl text-gray-400">Base × Farcaster Edition 🐦‍🔥</p>
      </div>

      {/* Game Area */}
      <div className="mb-8">
        <FlappyBirdGame />
      </div>

      {/* Wallet Section */}
      <div className="w-full max-w-[420px] px-4">
        <div className="bg-[#111111] border border-[#633BBC]/40 rounded-3xl p-6">
          <p className="text-sm text-gray-400 mb-4 text-center">Connect your wallet to save score on Base</p>
          <WalletConnectButton />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-xs text-gray-500 text-center">
        Phase 1 • Game + Frame Integration • 19/100 commits
      </div>
    </div>
  );
}
