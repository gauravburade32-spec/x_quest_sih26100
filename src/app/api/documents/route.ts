import { NextResponse } from 'next/server';
import { documentService } from '@/services';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bidderId = searchParams.get('bidderId');

  const documents = bidderId
    ? documentService.getDocumentsByBidderId(bidderId)
    : documentService.getDocuments();

  return NextResponse.json({ success: true, count: documents.length, data: documents });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.bidderId || !body.fileName) {
      return NextResponse.json(
        { success: false, error: 'bidderId and fileName are required fields.' },
        { status: 400 }
      );
    }

    const newDoc = documentService.addDocument(body);
    return NextResponse.json({ success: true, data: newDoc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid payload format.' }, { status: 400 });
  }
}
