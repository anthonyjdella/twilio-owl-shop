import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { action, phoneNumber, message } = await request.json();

        // Check if real calls are enabled (can be configured)
        const enableRealCalls = process.env.ENABLE_REAL_VOICE_CALLS !== 'false'; // Default to true unless explicitly disabled

        // Check if Twilio credentials are available
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

        if (!enableRealCalls) {
            return NextResponse.json({
                success: true,
                demo: true,
                error: 'Real voice calls disabled in configuration - demo mode only',
                sid: 'DEMO_CALL_' + Date.now()
            });
        }

        if (!accountSid || !authToken || !twilioPhoneNumber) {
            return NextResponse.json({
                success: false,
                demo: true,
                error: 'Twilio credentials not configured - running in demo mode',
                sid: 'DEMO_CALL_' + Date.now()
            });
        }

        if (!phoneNumber) {
            return NextResponse.json({
                success: false,
                demo: true,
                error: 'Phone number required for voice calls',
                sid: 'DEMO_CALL_' + Date.now()
            });
        }

        // Initialize Twilio client
        const twilio = require('twilio');
        const client = twilio(accountSid, authToken);

        // Create TwiML for the voice call
        const twimlMessage = message || 'Hello! This is a call from your Twilio Voice demo.';
        
        // Make the voice call
        const call = await client.calls.create({
            twiml: `<Response><Say voice="alice">${twimlMessage}</Say></Response>`,
            to: phoneNumber,
            from: twilioPhoneNumber,
        });

        return NextResponse.json({
            success: true,
            demo: false,
            sid: call.sid,
            status: call.status,
            to: call.to,
            from: call.from
        });

    } catch (error: any) {
        console.error('Voice API Error:', error);
        
        return NextResponse.json({
            success: false,
            demo: true,
            error: error.message || 'Failed to make voice call',
            sid: 'ERROR_CALL_' + Date.now()
        });
    }
}