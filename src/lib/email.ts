export async function sendNewSubmissionNotification(formData: any) {
  try {
    console.log('📧 Starting email notification process...');
    console.log('📋 Form data being sent:', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      location: formData.location,
      segments: formData.segments,
      betaTestingInterest: formData.betaTestingInterest,
      resonanceLevel: formData.resonanceLevel,
      resonanceReasons: formData.resonanceReasons,
      communitySelections: formData.communitySelections,
    });

    const response = await fetch('/api/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData }),
    });

    console.log('📡 Email API response status:', response.status);
    console.log('📡 Email API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Email API error response:', error);
      throw new Error(error.error || 'Failed to send notification');
    }

    const result = await response.json();
    console.log('✅ Email sent successfully:', result);
    console.log('📧 Email notification completed successfully');
    return result;
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'Unknown';
    
    console.error('❌ Full error details:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName
    });
    throw error;
  }
}

export async function sendReplyEmail(to: string, subject: string, message: string) {
  try {
    const response = await fetch('/api/send-reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, message }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send reply');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending reply:', error);
    throw error;
  }
}
