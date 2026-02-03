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
    console.log('📧 Server: Received email request');
    console.log('🔑 Server: RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('📋 Server: Request body keys:', Object.keys(req.body));
    
    const { formData } = req.body;

    if (!formData) {
      console.error('❌ Server: No form data received');
      return res.status(400).json({ error: 'Form data is required' });
    }

    console.log('📋 Server: Form data received:', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      hasPhone: !!formData.phone,
      location: formData.location,
      roleTypes: formData.roleTypes,
      betaTesting: formData.betaTesting,
      resonanceLevel: formData.resonanceLevel,
      resonanceReasons: formData.resonanceReasons,
      communitySelections: formData.communitySelections,
    });

    console.log('📧 Server: Preparing to send email to dev@kyozo.com');

    // Send email notification
    const { data, error } = await resend.emails.send({
      from: 'Kyozo Waitlist <waitlist@contact.kyozo.com>',
      to: ['dev@kyozo.com'],
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

    console.log('📡 Server: Resend API response:', { data, error });

    if (error) {
      console.error('❌ Server: Resend error:', error);
      console.error('❌ Server: Full error details:', JSON.stringify(error, null, 2));
      return res.status(400).json({ error: error.message });
    }

    console.log('✅ Server: Email sent successfully to dev@kyozo.com');
    console.log('📧 Server: Email ID:', data?.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ Server: Unexpected error:', error);
    console.error('❌ Server: Error stack:', error.stack);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
