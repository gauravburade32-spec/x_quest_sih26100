import { NextResponse } from 'next/server';
import { tenderService } from '@/services';

export async function GET() {
  const tenders = tenderService.getTenders();
  return NextResponse.json({ success: true, count: tenders.length, data: tenders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.referenceNo || !body.title) {
      return NextResponse.json(
        { success: false, error: 'Tender referenceNo and title are required fields.' },
        { status: 400 }
      );
    }

    const newTender = tenderService.addTender(body);
    return NextResponse.json({ success: true, data: newTender }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid payload format.' }, { status: 400 });
  }
}
