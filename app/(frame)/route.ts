import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'FlappyBase Frame is live 🐦‍🔥' 
  });
}

export async function POST() {
  return NextResponse.json({ message: 'Action received!' });
}
