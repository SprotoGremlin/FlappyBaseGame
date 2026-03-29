'use client';

import { useEffect, useRef, useState } from 'react';

export default function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 600;

    let birdY = 250;
    let birdVelocity = 0;
    const gravity = 0.5;
    const jump = -10;

    let frame = 0;
    let pipes: { x: number; top: number; passed: boolean }[] = [];

    const gameLoop = () => {
      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bird
      birdVelocity += gravity;
      birdY += birdVelocity;

      ctx.fillStyle = '#F9D71C';
      ctx.beginPath();
      ctx.arc(100, birdY, 15, 0, Math.PI * 2);
      ctx.fill();

      // Pipes
      if (frame % 90 === 0) {
        const topHeight = Math.random() * 250 + 100;
        pipes.push({ x: canvas.width, top: topHeight, passed: false });
      }

      for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        pipe.x -= 2;

        // Top pipe
        ctx.fillStyle = '#22C55E';
        ctx.fillRect(pipe.x, 0, 50, pipe.top);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.top + 180, 50, canvas.height);

        // Score
        if (!pipe.passed && pipe.x + 50 < 100) {
          pipe.passed = true;
          setScore(s => s + 1);
        }

        // Collision
        if (
          100 < pipe.x + 50 &&
          100 > pipe.x &&
          (birdY - 15 < pipe.top || birdY + 15 > pipe.top + 180)
        ) {
          setGameOver(true);
        }

        if (pipe.x < -50) pipes.splice(i, 1);
      }

      // Ground collision
      if (birdY > canvas.height - 30) {
        setGameOver(true);
      }

      frame++;
      if (!gameOver) requestAnimationFrame(gameLoop);
    };

    gameLoop();

    const handleJump = () => {
      if (!gameOver) birdVelocity = jump;
    };

    canvas.addEventListener('click', handleJump);
    canvas.addEventListener('touchstart', handleJump);

    return () => {
      canvas.removeEventListener('click', handleJump);
      canvas.removeEventListener('touchstart', handleJump);
    };
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-2xl font-bold text-[#F9D71C]">Score: {score}</div>
      <canvas 
        ref={canvasRef} 
        className="border-4 border-[#633BBC] rounded-2xl bg-black"
      />
      {gameOver && (
        <div className="mt-6 text-center">
          <div className="text-4xl text-red-500 mb-4">Game Over!</div>
          <div className="text-xl">Final Score: {score}</div>
        </div>
      )}
    </div>
  );
}
