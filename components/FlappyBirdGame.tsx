'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export default function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const resetGame = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 600;

    let birdY = 250;
    let birdVelocity = 0;
    const gravity = 0.6;
    const jumpStrength = -11;

    let frame = 0;
    let pipes: { x: number; top: number; passed: boolean }[] = [];

    const gameLoop = () => {
      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bird physics
      birdVelocity += gravity;
      birdY += birdVelocity;

      // Draw bird
      ctx.fillStyle = '#F9D71C';
      ctx.beginPath();
      ctx.arc(100, birdY, 16, 0, Math.PI * 2);
      ctx.fill();

      // Generate pipes
      if (frame % 85 === 0) {
        const top = Math.random() * 220 + 80;
        pipes.push({ x: canvas.width, top, passed: false });
      }

      // Update & draw pipes
      for (let i = pipes.length - 1; i >= 0; i--) {
        const p = pipes[i];
        p.x -= 2.2;

        ctx.fillStyle = '#22C55E';
        ctx.fillRect(p.x, 0, 55, p.top);                    // top pipe
        ctx.fillRect(p.x, p.top + 170, 55, canvas.height);  // bottom pipe

        // Score
        if (!p.passed && p.x + 55 < 100) {
          p.passed = true;
          setScore(s => s + 1);
        }

        // Collision
        if (
          100 < p.x + 55 && 100 > p.x &&
          (birdY - 16 < p.top || birdY + 16 > p.top + 170)
        ) {
          setGameOver(true);
          setIsPlaying(false);
        }

        if (p.x < -60) pipes.splice(i, 1);
      }

      // Ground & ceiling collision
      if (birdY > canvas.height - 40 || birdY < 0) {
        setGameOver(true);
        setIsPlaying(false);
      }

      frame++;

      if (!gameOver && isPlaying) {
        requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();

    const handleJump = (e: Event) => {
      e.preventDefault();
      if (!gameOver && isPlaying) birdVelocity = jumpStrength;
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
      <div className="mb-4 text-3xl font-bold text-[#F9D71C]">
        Score: {score}
      </div>

      <canvas
        ref={canvasRef}
        className="border-4 border-[#633BBC] rounded-2xl shadow-2xl"
      />

      {(gameOver || !isPlaying) && (
        <div className="mt-6 flex flex-col items-center gap-4">
          {gameOver && <div className="text-4xl text-red-500 font-bold">Game Over!</div>}
          
          <button
            onClick={resetGame}
            className="px-10 py-4 bg-[#633BBC] hover:bg-[#7C4DFF] text-white font-bold text-xl rounded-2xl transition-all active:scale-95"
          >
            RESTART GAME
          </button>
        </div>
      )}

      {!isPlaying && !gameOver && (
        <button
          onClick={resetGame}
          className="mt-6 px-10 py-4 bg-[#22C55E] hover:bg-[#16A34A] text-black font-bold text-xl rounded-2xl transition-all"
        >
          START GAME
        </button>
      )}
    </div>
  );
}
