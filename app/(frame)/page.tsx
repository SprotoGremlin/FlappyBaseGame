import FlappyBirdGame from '@/components/FlappyBirdGame';
import Leaderboard from '@/components/Leaderboard';
import { WalletConnectButton } from '@/components/WalletConnectButton';

export default function FlappyFrame() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] py-8 px-4 flex flex-col items-center gap-10">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-[#0052FF]/10 border border-[#0052FF]/30 text-[#60A5FA] text-xs font-medium px-4 py-1.5 rounded-full mb-3">
          🟦 OFFICIAL BASE EDITION
        </div>
        <h1 className="text-7xl font-black tracking-[-2px] mb-2 bg-gradient-to-r from-[#0052FF] via-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent">
          FlappyBase
        </h1>
        <p className="text-xl text-[#60A5FA] font-medium">Play. Score. Save on Base 🐦‍🔥</p>
      </div>

      {/* Game */}
      <div className="w-full max-w-[440px]">
        <div className="relative">
          <div className="absolute -inset-5 bg-gradient-to-r from-[#0052FF] to-[#3B82F6] opacity-25 blur-3xl rounded-3xl"></div>
          <FlappyBirdGame />
        </div>
      </div>

      {/* Leaderboard */}
      <div className="w-full max-w-[440px]">
        <Leaderboard />
      </div>

      {/* Wallet */}
      <div className="w-full max-w-[440px]">
        <div className="bg-[#111111] border border-[#0052FF]/50 rounded-3xl p-6">
          <p className="text-sm text-gray-400 mb-4 text-center">
            Connect your Base wallet to save your score onchain
          </p>
          <WalletConnectButton />
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-500 text-center">
        Phase 2 • Onchain Scores • 60/100 commits
      </div>
    </div>
  );
}
