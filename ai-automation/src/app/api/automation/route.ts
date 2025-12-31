import { NextResponse } from 'next/server';
import { runAutomation } from '@/lib/automation';

export async function POST() {
  try {
    const result = await runAutomation();

    return NextResponse.json(
      { success: true, result },
      { status: 200, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('[automation:error]', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to execute automation.',
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

export const runtime = 'nodejs';
