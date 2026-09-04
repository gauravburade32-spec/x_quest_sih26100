import { NextResponse } from 'next/server';
import { requirementService } from '@/services';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenderId = searchParams.get('tenderId') || 'TND-2026-GEM-8921';

  const requirements = requirementService.getRequirementsByTenderId(tenderId);
  return NextResponse.json({ success: true, tenderId, count: requirements.length, data: requirements });
}
