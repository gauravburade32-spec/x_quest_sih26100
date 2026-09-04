import { NextResponse } from 'next/server';
import { bidderService } from '@/services';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenderId = searchParams.get('tenderId');

  const bidders = tenderId
    ? bidderService.getBiddersByTenderId(tenderId)
    : bidderService.getBidders();

  return NextResponse.json({ success: true, count: bidders.length, data: bidders });
}
