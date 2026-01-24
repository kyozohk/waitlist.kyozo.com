import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json();

    await resend.emails.send({
      from: 'Will from Kyozo <will@kyozo.com>',
      to: to,
      subject: 'Response from Kyozo Team',
      html: message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}
