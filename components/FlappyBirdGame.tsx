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
  const [isNewHighScore, setIsNewHighScore] = useState(false);

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
    setIsPlaying(false);
    setShowConfetti(false);
    setIsNewHighScore(false);
  }, []);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

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

      if (myHighScore && score > Number(myHighScore)) {
        setIsNewHighScore(true);
      }

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

  const shareOnFarcaster = () => {
    const text = `I just scored ${score} on FlappyBase! 🐦‍🔥 Can you beat me? Play now on Base!`;
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Game Loop with increasing difficulty
  useEffect(() => {
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
    let clouds: { x: number; y: number; size: number }[] = [];

    for (let i = 0; i < 5; i++) {
      clouds.push({ x: Math.random() * canvas.width, y: 60 + Math.random() * 120, size: 30 + Math.random() * 25 });
    }

    let groundX = 0;

    const gameLoop = () => {
      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
      sky.addColorStop(0, '#0A0A2A');
      sky.addColorStop(1, '#1E3A8A');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Clouds
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      clouds.forEach(cloud => {
        cloud.x -= 0.4;
        if (cloud.x < -cloud.size * 2) cloud.x = canvas.width + 50;
        ctx.beginPath();
        ctx.ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Ground
      groundX -= 2.3;
      if (groundX <= -40) groundX = 0;
      ctx.fillStyle = '#166534';
      ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(groundX, canvas.height - 45, canvas.width + 40, 8);
      ctx.fillRect(groundX - 40, canvas.height - 45, canvas.width + 40, 8);

      if (isPlaying) {
        birdVelocity += gravity;
        birdY += birdVelocity;

        // Dynamic difficulty
        const pipeSpeed = score > 40 ? 3.2 : score > 25 ? 2.8 : 2.3;
        const pipeGap = score > 40 ? 155 : 175;

        // Bird
        const rotation = Math.min(Math.max(birdVelocity * 3, -25), 60);
        ctx.save();
        ctx.translate(100, birdY);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.fillStyle = '#F9D71C';
        ctx.beginPath();
        ctx.arc(0, 0, 17, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Pipes
        if (frame % 82 === 0) {
          const top = Math.random() * 220 + 100;
          pipes.push({ x: canvas.width, top, passed: false });
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
          const p = pipes[i];
          p.x -= pipeSpeed;

          ctx.fillStyle = '#22C55E';
          ctx.fillRect(p.x, 0, 58, p.top);
          ctx.fillRect(p.x, p.top + pipeGap, 58, canvas.height);

          // Pipe caps
          ctx.fillStyle = '#166534';
          ctx.fillRect(p.x - 4, p.top - 25, 66, 30);
          ctx.fillRect(p.x - 4, p.top + pipeGap, 66, 30);

          if (!p.passed && p.x + 58 < 100) {
            p.passed = true;
            setScore(s => s + 1);
          }

          if (
            100 < p.x + 58 && 100 > p.x &&
            (birdY - 17 < p.top || birdY + 17 > p.top + pipeGap)
          ) {
            setGameOver(true);
            setIsPlaying(false);
          }

          if (p.x < -70) pipes.splice(i, 1);
        }

        if (birdY > canvas.height - 60 || birdY < 20) {
          setGameOver(true);
          setIsPlaying(false);
        }

        // Score on canvas
        ctx.fillStyle = '#F9D71C';
        ctx.font = 'bold 48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(score.toString(), canvas.width / 2, 80);
      } else {
        // Start Screen
        ctx.fillStyle = '#F9D71C';
        ctx.font = 'bold 42px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('FlappyBase', canvas.width / 2, 170);

        ctx.fillStyle = '#60A5FA';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText('GET READY!', canvas.width / 2, 240);

        ctx.fillStyle = '#F9D71C';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('TAP TO FLAP', canvas.width / 2, 290);
      }

      frame++;
      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    const handleJump = (e: Event) => {
      e.preventDefault();
      if (!isPlaying && !gameOver) {
        startGame();
      } else if (isPlaying && !gameOver) {
        birdVelocity = jump;
        playJumpSound();
      }
    };

    canvas.addEventListener('click', handleJump);
    canvas.addEventListener('touchstart', handleJump, { passive: false });

    return () => {
      canvas.removeEventListener('click', handleJump);
      canvas.removeEventListener('touchstart', handleJump);
    };
  }, [isPlaying, gameOver, soundEnabled]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        className="border-4 border-[#0052FF] rounded-3xl shadow-2xl touch-none w-full max-w-[440px]"
      />

      {(gameOver || !isPlaying) && isPlaying && (
        <div className="mt-10 flex flex-col items-center gap-6 text-center">
          {gameOver && (
            <p className="text-5xl text-red-500 font-black tracking-wider">GAME OVER</p>
          )}

          {isNewHighScore && (
            <p className="text-3xl text-yellow-400 font-bold">🏆 NEW HIGH SCORE!</p>
          )}

          {myHighScore && (
            <p className="text-xl text-gray-300">
              Your best: <span className="text-[#60A5FA] font-bold">{myHighScore.toString()}</span>
            </p>
          )}

          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={resetGame}
              className="px-14 py-5 bg-gradient-to-r from-[#0052FF] to-[#3B82F6] text-white font-bold text-2xl rounded-2xl hover:scale-105 transition-all active:scale-95"
            >
              PLAY AGAIN
            </button>

            {address && gameOver && (
              <button
                onClick={submitScoreToChain}
                disabled={isSubmitting}
                className="px-14 py-5 bg-[#22C55E] hover:bg-[#16A34A] text-black font-bold text-2xl rounded-2xl transition-all disabled:opacity-70"
              >
                {isSubmitting ? 'SAVING ON BASE...' : 'SAVE SCORE ONCHAIN'}
              </button>
            )}

            {gameOver && score >= 15 && (
              <button
                onClick={shareOnFarcaster}
                className="px-10 py-5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xl rounded-2xl transition-all"
              >
                Share on Farcaster
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

// Share function
const shareOnFarcaster = () => {
  const scoreElement = document.querySelector('.text-5xl');
  const currentScore = scoreElement ? scoreElement.textContent : '0';
  const text = `I just scored ${currentScore} on FlappyBase! 🐦‍🔥 Can you beat me? Play now on Base!`;
  const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};
