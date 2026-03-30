'use client';

import { useAccount, useReadContract } from 'wagmi';
import { FlappyScoreABI, FLAPPY_SCORE_ADDRESS } from '@/lib/contract/FlappyScore';
import { useEffect, useState } from 'react';

export default function Leaderboard() {
  const { address } = useAccount();
  const [myHighScore, setMyHighScore] = useState<bigint | null>(null);

  const { data: totalPlays } = useReadContract({
    address: FLAPPY_SCORE_ADDRESS as `0x${string}`,
    abi: FlappyScoreABI,
    functionName: 'getTotalPlays',
  });

  const { data: highScore } = useReadContract({
    address: FLAPPY_SCORE_ADDRESS as `0x${string}`,
    abi: FlappyScoreABI,
    functionName: 'getHighScore',
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (highScore) setMyHighScore(highScore);
  }, [highScore]);

  return (
    <div className="w-full max-w-md bg-[#111111] border border-[#633BBC]/40 rounded-3xl p-6 mt-8">
      <h2 className="text-2xl font-bold text-[#F9D71C] mb-6 text-center">🏆 LEADERBOARD</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-[#1A1A1A] p-4 rounded-2xl">
          <span className="text-gray-400">Your High Score</span>
          <span className="text-3xl font-bold text-white">
            {myHighScore ? myHighScore.toString() : "—"}
          </span>
        </div>

        <div className="flex justify-between items-center bg-[#1A1A1A] p-4 rounded-2xl">
          <span className="text-gray-400">Total Games Played</span>
          <span className="text-2xl font-bold text-[#22C55E]">
            {totalPlays ? totalPlays.toString() : "0"}
          </span>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center mt-6">
        Connect wallet to see your score • Real onchain data coming soon
      </p>
    </div>
  );
}
