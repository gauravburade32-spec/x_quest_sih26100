import { NextResponse } from 'next/server';
import { auditService } from '@/services';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenderId = searchParams.get('tenderId');
  const bidderId = searchParams.get('bidderId');

  let events = auditService.getAuditEvents();
  if (tenderId) {
    events = auditService.getAuditEventsByTenderId(tenderId);
  } else if (bidderId) {
    events = auditService.getAuditEventsByBidderId(bidderId);
  }

  return NextResponse.json({ success: true, count: events.length, data: events });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.action || !body.eventType || !body.user) {
      return NextResponse.json(
        { success: false, error: 'action, eventType, and user are required fields.' },
        { status: 400 }
      );
    }

    const loggedEvent = auditService.logAuditEvent(body);
    return NextResponse.json({ success: true, data: loggedEvent }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid payload format.' }, { status: 400 });
  }
}
