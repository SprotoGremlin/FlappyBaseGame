import { WalletConnectButton } from '@/components/WalletConnectButton';

export default function FramePage() {
  return (
    <div className="min-h-screen bg-[var(--dark-bg)] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="flappy-title mb-6">FlappyBase</h1>
        <p className="text-2xl text-gray-300 mb-10">🐦‍🔥 Ready for Base & Farcaster</p>
        
        <div className="bg-[var(--dark-card)] p-8 rounded-3xl border border-[#633BBC]/30 mb-8">
          <WalletConnectButton />
        </div>

        <p className="text-xs text-gray-500">Phase 1 • Setup almost done</p>
      </div>
    </div>
  );
}
