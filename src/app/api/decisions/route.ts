import { NextResponse } from 'next/server';
import { decisionService } from '@/services';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bidderId = searchParams.get('bidderId');

  const decisions = bidderId
    ? decisionService.getOfficerDecisionByBidderId(bidderId)
    : decisionService.getOfficerDecisions();

  return NextResponse.json({ success: true, data: decisions });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.bidderId || !body.decision || !body.rationale) {
      return NextResponse.json(
        { success: false, error: 'bidderId, decision, and rationale are required fields.' },
        { status: 400 }
      );
    }

    const savedRecord = decisionService.saveOfficerDecision(body.bidderId, body);
    return NextResponse.json({ success: true, data: savedRecord }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid payload format.' }, { status: 400 });
  }
}
