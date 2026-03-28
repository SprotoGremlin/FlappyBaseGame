import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'FlappyBase Farcaster Frame is live 🐦‍🔥'
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Frame action received - game coming soon!'
  });
}
