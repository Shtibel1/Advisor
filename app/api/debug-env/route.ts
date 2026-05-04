import { NextResponse } from 'next/server'

// TEMPORARY – remove before shipping to production
export async function GET() {
  return NextResponse.json({
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? 'SET' : 'MISSING',
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? 'SET' : 'MISSING',
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER ? 'SET' : 'MISSING',
    VOICEFLOW_API_KEY: process.env.VOICEFLOW_API_KEY ? 'SET' : 'MISSING',
  })
}
