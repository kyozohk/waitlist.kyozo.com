import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, message } = req.body;

    await resend.emails.send({
      from: 'Will from Kyozo <will@kyozo.com>',
      to: to,
      subject: 'Response from Kyozo Team',
      html: message,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({ error: 'Failed to send reply' });
  }
}
