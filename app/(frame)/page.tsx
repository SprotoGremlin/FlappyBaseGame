import { WalletConnectButton } from '@/components/WalletConnectButton';

export default function FlappyFrame() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <div className="text-center max-w-md mx-auto">
        {/* Logo + Title */}
        <div className="mb-12">
          <h1 className="text-8xl font-black tracking-tighter mb-2 bg-gradient-to-r from-[#F9D71C] via-[#633BBC] to-[#0052FF] bg-clip-text text-transparent">
            FlappyBase
          </h1>
          <p className="text-3xl text-gray-400">🐦‍🔥</p>
        </div>

        <p className="text-2xl text-gray-300 mb-16">Play on Base &amp; Farcaster</p>

        {/* Wallet Area */}
        <div className="bg-[#111111] border border-[#633BBC]/50 rounded-3xl p-12 mb-8">
          <WalletConnectButton />
        </div>

        <div className="text-xs text-gray-500">
          Phase 1 • Setup • 14/100 commits
        </div>
      </div>
    </div>
  );
}
