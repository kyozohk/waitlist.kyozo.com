import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({ error: 'Form data is required' });
    }

    // Send email notification
    const { data, error } = await resend.emails.send({
      from: 'Kyozo Waitlist <waitlist@kyozo.com>',
      to: ['team@kyozo.com'], // Replace with your team email
      subject: `New Waitlist Submission from ${formData.firstName} ${formData.lastName}`,
      html: `
        <h2>New Waitlist Submission</h2>
        <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Location:</strong> ${formData.location}</p>
        <p><strong>Role Types:</strong> ${formData.roleTypes.join(', ')}</p>
        <p><strong>Creative Work:</strong> ${formData.creativeWork}</p>
        <p><strong>Beta Testing:</strong> ${formData.betaTesting}</p>
        <p><strong>Resonance Level:</strong> ${formData.resonanceLevel}/5</p>
        <p><strong>Resonance Reasons:</strong> ${formData.resonanceReasons.join(', ')}</p>
        <p><strong>Community Selections:</strong> ${formData.communitySelections.join(', ')}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
