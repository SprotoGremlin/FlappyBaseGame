"use client";

import { useState } from "react";
import { Transaction, TransactionButton, TransactionStatus } from "@coinbase/onchainkit/transaction";
import { parseEther } from "viem";
import { MATCH_CONTRACT_ADDRESS, MATCH_CONTRACT_ABI } from "@/lib/contracts";
import { useAccount } from "wagmi";

export default function MatchCreator({ onMatchCreated }: { onMatchCreated: (id: string) => void }) {
  const [betAmount, setBetAmount] = useState("0.05");
  const [isCreating, setIsCreating] = useState(false);
  const { address } = useAccount();

  const handleSuccess = (tx: any) => {
    const matchId = "match-" + Date.now();
    onMatchCreated(matchId);
    alert(`✅ MATCH CREATED! Tx: ${tx.transactionHash} • Share link sent to friend`);
    setIsCreating(false);
  };

  return (
    <div className="mt-6 glass p-5 border border-[#0052FF]/40 rounded-3xl">
      <div className="text-sm font-semibold mb-3">CREATE NEW MATCH • ESCROW BET</div>
      
      <div className="flex gap-3">
        <input
          type="text"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          className="flex-1 bg-black border border-white/30 px-4 py-3 rounded-2xl font-mono text-xl text-center"
          placeholder="0.05"
        />
        <Transaction
          calls={[
            {
              to: MATCH_CONTRACT_ADDRESS,
              data: "0x" as `0x${string}`, // createMatch calldata placeholder
              value: parseEther(betAmount),
            },
          ]}
          onSuccess={handleSuccess}
        >
          <TransactionButton className="px-10 py-3 bg-white text-black font-bold rounded-2xl hover:bg-white/90">
            {isCreating ? "CONFIRMING..." : "CREATE MATCH"}
          </TransactionButton>
          <TransactionStatus />
        </Transaction>
      </div>

      <div className="text-[10px] text-white/40 mt-3 text-center font-mono">
        0.05 ETH ESCROW • 50/50 POT SPLIT • VIEW ON BASESCAN AFTER CONFIRM
      </div>
    </div>
  );
}
