import FlappyBirdGame from '@/components/FlappyBirdGame';
import { WalletConnectButton } from '@/components/WalletConnectButton';

export default function FlappyFrame() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 gap-8">
      <div className="text-center">
        <h1 className="text-7xl font-black tracking-tighter mb-2 bg-gradient-to-r from-[#F9D71C] via-[#633BBC] to-[#0052FF] bg-clip-text text-transparent">
          FlappyBase
        </h1>
        <p className="text-xl text-gray-400">Base + Farcaster Edition</p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <FlappyBirdGame />
        
        <div className="pt-4 border-t border-[#633BBC]/30 w-full max-w-[400px]">
          <WalletConnectButton />
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Phase 1 • Game Canvas Live • 17/100 commits
      </div>
    </div>
  );
}
