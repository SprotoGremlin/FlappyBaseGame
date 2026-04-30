"use client";

import { useState } from "react";
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusLabel, TransactionStatusAction } from "@coinbase/onchainkit/transaction";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import { motion } from "framer-motion";
import { Zap, Users, Clock } from "lucide-react";

interface MatchCreatorProps {
  onMatchCreated?: (matchId: string) => void;
  onClose?: () => void;
}

export default function MatchCreator({ onMatchCreated, onClose }: MatchCreatorProps) {
  const { address, isConnected } = useAccount();
  const [betAmount, setBetAmount] = useState("0.05");
  const [isCreating, setIsCreating] = useState(false);

  // Placeholder contract address (replace with real deployed contract in later commits)
  const MATCH_CONTRACT = "0x0000000000000000000000000000000000000000" as `0x${string}`;

  const calls = [
    {
      to: MATCH_CONTRACT,
      data: "0x", // TODO: Replace with actual createMatch calldata
      value: parseEther(betAmount),
    },
  ];

  const handleSuccess = (response: any) => {
    console.log("Match created onchain:", response);
    const matchId = `0x${Date.now().toString(16)}`;
    onMatchCreated?.(matchId);
    setIsCreating(false);
  };

  const quickBets = ["0.02", "0.05", "0.1", "0.25"];

  return (
    <div className="glass w-full max-w-md mx-auto p-9 border border-[#0052FF]/40">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-3xl font-semibold tracking-tight">CREATE MATCH</div>
          <div className="text-xs text-[#0052FF] tracking-[2px] mt-1">ONCHAIN ESCROW • BASE</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/50 hover:text-white text-2xl">×</button>
        )}
      </div>

      {!isConnected ? (
        <div className="text-center py-10">
          <div className="text-6xl mb-6 opacity-60">👾</div>
          <div className="text-xl mb-3">Connect wallet to tear reality</div>
          <div className="text-sm text-white/50">You need a Base wallet to create matches</div>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <div className="text-xs tracking-[1.5px] text-white/60 mb-3">YOUR BET (ETH)</div>
            
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full bg-black border border-white/20 text-4xl font-mono py-4 px-5 focus:outline-none focus:border-[#0052FF] rounded-xl"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#0052FF] text-sm">ETH</div>
            </div>

            <div className="flex gap-2 mt-3">
              {quickBets.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setBetAmount(amt)}
                  className={`flex-1 py-2 text-xs border transition-all ${betAmount === amt 
                    ? "border-[#0052FF] bg-[#0052FF]/10 text-[#0052FF]" 
                    : "border-white/20 hover:border-white/50"}`}
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 mb-8 text-sm">
            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-white/60">Your Stake</span>
              <span className="font-mono text-[#0052FF]">{betAmount} ETH</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-white/60">Opponent Stake</span>
              <span className="font-mono text-[#0052FF]">{betAmount} ETH</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>TOTAL POT</span>
              <span className="font-mono text-white">{(parseFloat(betAmount) * 2).toFixed(2)} ETH</span>
            </div>
          </div>

          <Transaction
            chainId={8453} // Base Mainnet
            calls={calls}
            onSuccess={handleSuccess}
            onError={(error) => {
              console.error("Transaction failed:", error);
              setIsCreating(false);
            }}
          >
            <TransactionButton
              className="w-full py-4 bg-[#0052FF] hover:bg-[#0033aa] text-black font-semibold text-base tracking-[1px] active:scale-[0.985] transition-all flex items-center justify-center gap-3"
              disabled={!betAmount || parseFloat(betAmount) <= 0}
            >
              <Zap className="w-5 h-5" />
              ESCROW &amp; CREATE MATCH ON BASE
            </TransactionButton>

            <div className="mt-4">
              <TransactionStatus>
                <TransactionStatusLabel className="text-xs text-white/60" />
                <TransactionStatusAction className="text-xs text-[#0052FF] hover:underline" />
              </TransactionStatus>
            </div>
          </Transaction>

          <div className="text-center text-[10px] text-white/40 mt-6 tracking-widest">
            POWERED BY ONCHAINKIT • GASLESS VIA PAYMASTER
          </div>
        </>
      )}

      <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/50 flex items-center justify-center gap-2">
        <Clock className="w-3.5 h-3.5" /> Matches auto-expire in 24h if no opponent
      </div>
    </div>
  );
}
