import { WalletConnectButton } from '@/components/WalletConnectButton';

export default function FlappyFrame() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-7xl font-black mb-6 tracking-tighter bg-gradient-to-r from-[#F9D71C] via-[#633BBC] to-[#0052FF] bg-clip-text text-transparent">
          FlappyBase
        </h1>
        <p className="text-2xl text-gray-300 mb-12">🐦‍🔥 Play on Base & Farcaster</p>

        <div className="bg-[#111111] border border-[#633BBC]/40 rounded-3xl p-10">
          <WalletConnectButton />
        </div>

        <p className="mt-10 text-xs text-gray-500">Phase 1 • 13/100 commits</p>
      </div>
    </div>
  );
}
