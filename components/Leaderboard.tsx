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

      <div className="bg-[#1A1A1A] rounded-2xl p-6">
        <div className="flex justify-between items-center py-4 border-b border-gray-800">
          <span className="text-gray-400 text-lg">Your High Score</span>
          <span className="text-5xl font-bold text-white">
            {loading ? '...' : (myHighScore ? myHighScore.toString() : '0')}
          </span>
        </div>

        <div className="pt-6 text-center text-sm text-gray-500">
          More players = bigger leaderboard coming soon
        </div>
      </div>

      <p className="text-[10px] text-gray-600 text-center mt-6">
        All scores are saved permanently on Base
      </p>
    </div>
  );
}
