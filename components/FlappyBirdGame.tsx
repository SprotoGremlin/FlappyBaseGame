'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { FlappyScoreABI, FLAPPY_SCORE_ADDRESS } from '@/lib/contract/FlappyScore';

export default function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const resetGame = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setSubmitError(null);
  }, []);

    const submitScoreToChain = async () => {
    if (!address || score === 0) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await writeContract({
        address: FLAPPY_SCORE_ADDRESS as `0x${string}`,
        abi: FlappyScoreABI,
        functionName: 'submitScore',
        args: [BigInt(score)],
      });

      // Ωραίο toast
      const toast = document.createElement('div');
      toast.className = "fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#22C55E] text-black font-bold px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50";
      toast.innerHTML = `✅ Score ${score} saved on Base!`;
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.transition = 'all 0.4s';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
      }, 2800);

    } catch (error: any) {
      console.error(error);
      setSubmitError(error?.message || 'Failed to submit score');
      
      const toast = document.createElement('div');
      toast.className = "fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-600 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl z-50";
      toast.innerHTML = `❌ Failed to save score`;
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.transition = 'all 0.4s';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
      }, 2500);
    }
    setIsSubmitting(false);
  };
  // Game loop (ίδιο με πριν - για συντομία το κρατάμε όπως ήταν)
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 620;

    let birdY = 280;
    let birdVelocity = 0;
    const gravity = 0.55;
    const jump = -11.5;

    let frame = 0;
    let pipes: { x: number; top: number; passed: boolean }[] = [];

    const gameLoop = () => {
      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      birdVelocity += gravity;
      birdY += birdVelocity;

      ctx.fillStyle = '#F9D71C';
      ctx.beginPath();
      ctx.arc(100, birdY, 17, 0, Math.PI * 2);
      ctx.fill();

      if (frame % 82 === 0) {
        const top = Math.random() * 230 + 90;
        pipes.push({ x: canvas.width, top, passed: false });
      }

      for (let i = pipes.length - 1; i >= 0; i--) {
        const p = pipes[i];
        p.x -= 2.3;

        ctx.fillStyle = '#22C55E';
        ctx.fillRect(p.x, 0, 58, p.top);
        ctx.fillRect(p.x, p.top + 175, 58, canvas.height);

        if (!p.passed && p.x + 58 < 100) {
          p.passed = true;
          setScore(s => s + 1);
        }

        if (
          100 < p.x + 58 && 100 > p.x &&
          (birdY - 17 < p.top || birdY + 17 > p.top + 175)
        ) {
          setGameOver(true);
          setIsPlaying(false);
        }

        if (p.x < -70) pipes.splice(i, 1);
      }

      if (birdY > canvas.height - 45 || birdY < 20) {
        setGameOver(true);
        setIsPlaying(false);
      }

      frame++;
      if (isPlaying && !gameOver) requestAnimationFrame(gameLoop);
    };

    gameLoop();

    const handleJump = (e: Event) => {
      e.preventDefault();
      if (isPlaying && !gameOver) birdVelocity = jump;
    };

    canvas.addEventListener('click', handleJump);
    canvas.addEventListener('touchstart', handleJump);

    return () => {
      canvas.removeEventListener('click', handleJump);
      canvas.removeEventListener('touchstart', handleJump);
    };
  }, [isPlaying, gameOver]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-4xl font-bold text-[#F9D71C] tracking-wider">
        {score}
      </div>

      <canvas
        ref={canvasRef}
        className="border-4 border-[#633BBC] rounded-3xl shadow-2xl touch-none"
      />

      {(gameOver || !isPlaying) && (
        <div className="mt-8 flex flex-col items-center gap-5">
          {gameOver && <p className="text-3xl text-red-500 font-bold">Game Over!</p>}
          
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={resetGame}
              className="px-10 py-4 bg-gradient-to-r from-[#633BBC] to-[#7C4DFF] text-white font-bold text-xl rounded-2xl hover:scale-105 transition-all"
            >
              PLAY AGAIN
            </button>

            {address && gameOver && (
              <button
                onClick={submitScoreToChain}
                disabled={isSubmitting}
                className="px-10 py-4 bg-[#22C55E] hover:bg-[#16A34A] text-black font-bold text-xl rounded-2xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'SAVING ON BASE...' : 'SAVE SCORE ONCHAIN'}
              </button>
            )}
          </div>

          {submitError && (
            <p className="text-red-500 text-sm mt-2">{submitError}</p>
          )}
        </div>
      )}
    </div>
  );
}
