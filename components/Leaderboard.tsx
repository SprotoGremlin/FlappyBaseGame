'use client';

import { useAccount, useReadContract } from 'wagmi';
import { FlappyScoreABI, FLAPPY_SCORE_ADDRESS } from '@/lib/contract/FlappyScore';
import { useState, useEffect } from 'react';

export default function Leaderboard() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(true);

  const { data: totalPlays, isLoading: totalLoading } = useReadContract({
    address: FLAPPY_SCORE_ADDRESS as `0x${string}`,
    abi: FlappyScoreABI,
    functionName: 'getTotalPlays',
  });

  const { data: myHighScore, isLoading: scoreLoading } = useReadContract({
    address: FLAPPY_SCORE_ADDRESS as `0x${string}`,
    abi: FlappyScoreABI,
    functionName: 'getHighScore',
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (!totalLoading && !scoreLoading) {
      setLoading(false);
    }
  }, [totalLoading, scoreLoading]);

  return (
    <div className="w-full max-w-[440px] bg-[#111111] border border-[#0052FF]/40 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#60A5FA]">🏆 Leaderboard</h2>
        <div className="text-xs px-3 py-1 bg-[#0052FF]/10 text-[#60A5FA] rounded-full">
          Total Plays: {totalPlays ? totalPlays.toString() : '—'}
        </div>
      </div>

      {/* My Score */}
      <div className="bg-[#1A1A1A] rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Your High Score</span>
          <span className="text-5xl font-bold text-white">
            {loading ? '...' : (myHighScore ? myHighScore.toString() : '0')}
          </span>
        </div>
      </div>

      {/* Placeholder for Global Top Scores */}
      <div className="bg-[#1A1A1A] rounded-2xl p-5">
        <p className="text-[#60A5FA] font-medium mb-4 text-sm">GLOBAL TOP SCORES</p>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>1. Coming soon...</span>
            <span>—</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>2. Coming soon...</span>
            <span>—</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>3. Coming soon...</span>
            <span>—</span>
          </div>
        </div>
        <p className="text-[10px] text-gray-600 mt-6 text-center">
          More players = real global leaderboard
        </p>
      </div>

      <p className="text-[10px] text-gray-600 text-center mt-6">
        All scores are saved permanently on Base Sepolia
      </p>
    </div>
  );
}
