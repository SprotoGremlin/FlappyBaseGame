import FlappyBirdGame from '@/components/FlappyBirdGame';
import Leaderboard from '@/components/Leaderboard';
import { WalletConnectButton } from '@/components/WalletConnectButton';

export default function FlappyFrame() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] py-6 px-4 flex flex-col items-center gap-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-6xl font-black tracking-tighter mb-2 bg-gradient-to-r from-[#F9D71C] via-[#633BBC] to-[#0052FF] bg-clip-text text-transparent">
          FlappyBase
        </h1>
        <p className="text-lg text-gray-400">Base × Farcaster Edition 🐦‍🔥</p>
      </div>

      {/* Game - πιο κεντραρισμένο */}
      <div className="w-full max-w-[420px]">
        <FlappyBirdGame />
      </div>

      {/* Leaderboard */}
      <div className="w-full max-w-[420px]">
        <Leaderboard />
      </div>

      {/* Wallet */}
      <div className="w-full max-w-[420px]">
        <div className="bg-[#111111] border border-[#633BBC]/40 rounded-3xl p-6">
          <p className="text-sm text-gray-400 mb-4 text-center">
            Connect your Base wallet to save your score onchain
          </p>
          <WalletConnectButton />
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-500 text-center">
        Phase 2 • Onchain Scores • 33/100 commits
      </div>
    </div>
  );
}
