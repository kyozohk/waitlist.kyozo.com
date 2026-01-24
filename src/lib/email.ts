export interface EmailNotificationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  roleTypes: string[];
  creativeWork: string;
  segments: string[];
}

export const sendNewSubmissionNotification = async (data: EmailNotificationData) => {
  try {
    const response = await fetch('/api/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to send notification email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw error;
  }
};

export const sendReplyEmail = async (to: string, message: string) => {
  try {
    const response = await fetch('/api/send-reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, message }),
    });

    if (!response.ok) {
      throw new Error('Failed to send reply email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending reply email:', error);
    throw error;
  }
};
