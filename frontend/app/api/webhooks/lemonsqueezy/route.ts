import {
    processWebhookEvent,
    storeWebhookEvent,
} from '@/lib/lemon-squeezy/actions';
import { webhookHasMeta } from '@/lib/lemon-squeezy/typeguards';
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

// Lemon Squeezy Webhook: process a subscription event
export async function POST(req: Request) {
    try {
        if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
            return new Response(
                'Lemon Squeezy Webhook Secret not set in .env',
                { status: 500 }
            );
        }

        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

        // Log request headers and body for debugging
        console.log('Request Headers:', req.headers);
        const rawBody = await req.text();
        console.log('Raw Request Body:', rawBody);

        // Check the request signature
        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(rawBody, 'utf8');
        const digest = Buffer.from(hmac.digest('hex'), 'hex');

        const signature = Buffer.from(
            req.headers.get('X-Signature') || '',
            'hex'
        );

        // Use timingSafeEqual to prevent timing attacks
        if (digest.length !== signature.length || !crypto.timingSafeEqual(digest, signature)) {
            console.error('Invalid signature. Digest:', digest, 'Signature:', signature);
            return new Response('Invalid signature.', { status: 401 });
        }

        // Parse the Lemon Squeezy event
        let data;
        try {
            data = JSON.parse(rawBody);
            console.log('Parsed Data:', data);
        } catch (err) {
            console.error('Failed to parse JSON:', rawBody);
            return new Response('Invalid JSON payload.', { status: 400 });
        }

        // Type guard to check if the object has a 'meta' property.
        if (webhookHasMeta(data)) {
            const webhookEvent = await storeWebhookEvent(
                data.meta.event_name,
                data
            );

            await processWebhookEvent(webhookEvent);

            console.log('Webhook event processed successfully.');
            return NextResponse.json({ success: true });
        }

        console.error('Data invalid: Missing meta property.');
        return NextResponse.json({ error: 'Data invalid' }, { status: 400 });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error:error }, { status: 500 });
    }
}
