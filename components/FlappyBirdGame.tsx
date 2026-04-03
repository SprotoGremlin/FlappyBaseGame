'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { FlappyScoreABI, FLAPPY_SCORE_ADDRESS } from '@/lib/contract/FlappyScore';

export default function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const { data: myHighScore } = useReadContract({
    address: FLAPPY_SCORE_ADDRESS as `0x${string}`,
    abi: FlappyScoreABI,
    functionName: 'getHighScore',
    args: address ? [address] : undefined,
  });

  const resetGame = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setShowConfetti(false);
  }, []);

  const submitScoreToChain = async () => {
    if (!address || score === 0) return;

    setIsSubmitting(true);

    try {
      await writeContract({
        address: FLAPPY_SCORE_ADDRESS as `0x${string}`,
        abi: FlappyScoreABI,
        functionName: 'submitScore',
        args: [BigInt(score)],
      });

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2800);

    } catch (error) {
      alert("❌ Failed to save score. Make sure you're on Base Sepolia.");
    }
    setIsSubmitting(false);
  };

  const playJumpSound = () => {
    if (!soundEnabled) return;
    try {
      const audio = new AudioContext();
      const oscillator = audio.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = 620;
      const gain = audio.createGain();
      gain.gain.value = 0.15;
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start();
      setTimeout(() => oscillator.stop(), 70);
    } catch {}
  };

  // Game Loop
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
      if (isPlaying && !gameOver) {
        birdVelocity = jump;
        playJumpSound();
      }
    };

    canvas.addEventListener('click', handleJump);
    canvas.addEventListener('touchstart', handleJump);

    return () => {
      canvas.removeEventListener('click', handleJump);
      canvas.removeEventListener('touchstart', handleJump);
    };
  }, [isPlaying, gameOver, soundEnabled]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex items-center gap-6">
        <div className="text-5xl font-bold text-[#F9D71C] tracking-wider">
          {score}
        </div>
        {myHighScore && (
          <div className="text-sm text-gray-400">
            Best: <span className="text-[#60A5FA] font-medium">{myHighScore.toString()}</span>
          </div>
        )}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-2xl text-gray-400 hover:text-white transition"
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="border-4 border-[#0052FF] rounded-3xl shadow-2xl touch-none"
      />

      {(gameOver || !isPlaying) && (
        <div className="mt-10 flex flex-col items-center gap-6 text-center">
          {gameOver && (
            <p className="text-5xl text-red-500 font-black tracking-wider">GAME OVER</p>
          )}

          {myHighScore && (
            <p className="text-xl text-gray-300">
              Your best score: <span className="text-[#60A5FA] font-bold">{myHighScore.toString()}</span>
            </p>
          )}

          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={resetGame}
              className="px-12 py-5 bg-gradient-to-r from-[#0052FF] to-[#3B82F6] text-white font-bold text-2xl rounded-2xl hover:scale-105 transition-all active:scale-95"
            >
              PLAY AGAIN
            </button>

            {address && gameOver && (
              <button
                onClick={submitScoreToChain}
                disabled={isSubmitting}
                className="px-12 py-5 bg-[#22C55E] hover:bg-[#16A34A] text-black font-bold text-2xl rounded-2xl transition-all disabled:opacity-70"
              >
                {isSubmitting ? 'SAVING ON BASE...' : 'SAVE SCORE ONCHAIN'}
              </button>
            )}
          </div>

          {showConfetti && (
            <p className="text-green-400 text-xl font-medium mt-2">🎉 Score saved on Base!</p>
          )}
        </div>
      )}
    </div>
  );
}
