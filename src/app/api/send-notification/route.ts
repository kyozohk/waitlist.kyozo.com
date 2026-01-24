import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, location, roleTypes, creativeWork, segments } = await request.json();

    const emailContent = `
      <h2>New Waitlist Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Role Types:</strong> ${roleTypes.join(', ')}</p>
      <p><strong>Segments:</strong> ${segments.join(', ')}</p>
      <p><strong>Creative Work:</strong></p>
      <p>${creativeWork}</p>
    `;

    await resend.emails.send({
      from: 'Kyozo Waitlist <notifications@kyozo.com>',
      to: 'ashok@kyozo.com',
      subject: `New Waitlist Submission from ${firstName} ${lastName}`,
      html: emailContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
