import { type NextRequest, NextResponse } from 'next/server';
import { getPositionPaperFile } from '@/lib/position-paper-actions';

// Serves the raw base64-encoded file stored in the DB for uploaded position papers.
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const paperId = parseInt(id, 10);
    if (isNaN(paperId)) {
        return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const paper = await getPositionPaperFile(paperId);
    if (!paper || !paper.file_data) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const buffer = Buffer.from(paper.file_data, 'base64');
    const contentType = paper.file_type ?? 'application/octet-stream';
    const fileName = paper.file_name ?? `paper-${paperId}`;

    return new NextResponse(buffer, {
        status: 200,
        headers: {
            'Content-Type': contentType,
            'Content-Disposition': `inline; filename="${fileName}"`,
            'Cache-Control': 'private, max-age=3600',
        },
    });
}
