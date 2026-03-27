export default function FramePage() {
  return (
    <div className="min-h-screen bg-[var(--dark-bg)] flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="flappy-title mb-6">FlappyBase</h1>
        <p className="text-2xl text-gray-300 mb-8">🐦‍🔥 Ready for Base &amp; Farcaster</p>
        
        <div className="inline-block bg-[var(--dark-card)] px-8 py-4 rounded-2xl border border-[#633BBC]/30">
          <p className="text-sm text-gray-400">Phase 1 • Setup in progress</p>
          <p className="text-lg font-medium text-[#F9D71C]">Next: Game Canvas</p>
        </div>
      </div>
    </div>
  );
}
