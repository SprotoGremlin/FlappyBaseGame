'use client';

import { useAccount, useReadContract } from 'wagmi';
import { FlappyScoreABI, FLAPPY_SCORE_ADDRESS } from '@/lib/contract/FlappyScore';

export default function Leaderboard() {
  const { address } = useAccount();
  
  const { data: totalPlays } = useReadContract({
    address: FLAPPY_SCORE_ADDRESS as `0x${string}`,
    abi: FlappyScoreABI,
    functionName: 'getTotalPlays',
  });

  const { data: myHighScore } = useReadContract({
    address: FLAPPY_SCORE_ADDRESS as `0x${string}`,
    abi: FlappyScoreABI,
    functionName: 'getHighScore',
    args: address ? [address] : undefined,
  });

  return (
    <div className="w-full max-w-[440px] bg-[#111111] border border-[#0052FF]/40 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#60A5FA]">🏆 Leaderboard</h2>
        <div className="text-xs px-3 py-1 bg-[#0052FF]/10 text-[#60A5FA] rounded-full">
          Total Plays: {totalPlays ? totalPlays.toString() : '0'}
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-2xl p-6">
        <div className="flex justify-between items-center py-3">
          <span className="text-gray-400">Your High Score</span>
          <span className="text-4xl font-bold text-white">
            {myHighScore ? myHighScore.toString() : '—'}
          </span>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500 mt-6">
        Global top players coming after contract deployment
      </p>
    </div>
  );
}
