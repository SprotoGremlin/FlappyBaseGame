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
  const [showConfetti, setShowConfetti] = useState(false);

  const { address } = useAccount();
  const { writeContract } = useWriteContract();

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
      setTimeout(() => setShowConfetti(false), 3000);

    } catch (error) {
      alert("❌ Failed to save score. Make sure you're on Base Sepolia.");
    }
    setIsSubmitting(false);
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
      if (isPlaying && !gameOver) birdVelocity = jump;
    };

    canvas.addEventListener('click', handleJump);
    canvas.addEventListener('touchstart', handleJump);

    return () => {
      canvas.removeEventListener('click', handleJump);
      canvas.removeEventListener('touchstart', handleJump);
    };
  }, [isPlaying, gameOver]);

  // Confetti Effect
  useEffect(() => {
    if (!showConfetti) return;

    const colors = ['#0052FF', '#3B82F6', '#60A5FA', '#F9D71C', '#22C55E'];
    let particles: any[] = [];

    const createParticle = () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 0.6,
      size: Math.random() * 8 + 4,
      speed: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 10 - 5,
    });

    for (let i = 0; i < 80; i++) {
      particles.push(createParticle());
    }

    const animateConfetti = () => {
      const canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '100';
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d')!;

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let stillAlive = false;

        particles.forEach((p, i) => {
          p.y += p.speed;
          p.rotation += p.rotationSpeed;
          p.speed += 0.05;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();

          if (p.y < canvas.height + 50) stillAlive = true;
        });

        if (stillAlive) {
          requestAnimationFrame(animate);
        } else {
          canvas.remove();
        }
      };

      animate();
    };

    animateConfetti();
  }, [showConfetti]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-4xl font-bold text-[#F9D71C] tracking-wider">
        {score}
      </div>

      <canvas
        ref={canvasRef}
        className="border-4 border-[#0052FF] rounded-3xl shadow-2xl touch-none"
      />

      {(gameOver || !isPlaying) && (
        <div className="mt-8 flex flex-col items-center gap-5">
          {gameOver && <p className="text-3xl text-red-500 font-bold">Game Over!</p>}
          
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={resetGame}
              className="px-10 py-4 bg-gradient-to-r from-[#0052FF] to-[#3B82F6] text-white font-bold text-xl rounded-2xl hover:scale-105 transition-all"
            >
              PLAY AGAIN
            </button>

            {address && gameOver && (
              <button
                onClick={submitScoreToChain}
                disabled={isSubmitting}
                className="px-10 py-4 bg-[#22C55E] hover:bg-[#16A34A] text-black font-bold text-xl rounded-2xl transition-all disabled:opacity-70"
              >
                {isSubmitting ? 'SAVING ON BASE...' : 'SAVE SCORE ONCHAIN'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
