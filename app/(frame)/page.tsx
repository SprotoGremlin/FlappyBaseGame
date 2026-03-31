import FlappyBirdGame from '@/components/FlappyBirdGame';
import Leaderboard from '@/components/Leaderboard';
import { WalletConnectButton } from '@/components/WalletConnectButton';

export default function FlappyFrame() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] py-6 px-4 flex flex-col items-center gap-8">
      {/* Header - Base Blue Style */}
      <div className="text-center">
        <h1 className="text-6xl font-black tracking-tighter mb-2 bg-gradient-to-r from-[#0052FF] via-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent">
          FlappyBase
        </h1>
        <p className="text-lg text-[#60A5FA]">Official Base Edition 🐦‍🔥</p>
      </div>

      {/* Game with Base Blue Glow */}
      <div className="w-full max-w-[420px]">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#0052FF] to-[#3B82F6] opacity-30 blur-2xl rounded-3xl"></div>
          <FlappyBirdGame />
        </div>
      </div>

      {/* Leaderboard */}
      <div className="w-full max-w-[420px]">
        <Leaderboard />
      </div>

      {/* Wallet */}
      <div className="w-full max-w-[420px]">
        <div className="bg-[#111111] border border-[#0052FF]/40 rounded-3xl p-6">
          <p className="text-sm text-gray-400 mb-4 text-center">
            Connect your Base wallet to save your score onchain
          </p>
          <WalletConnectButton />
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-500 text-center">
        Phase 2 • Onchain Scores • 35/100 commits
      </div>
    </div>
  );
}
