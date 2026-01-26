pass code to access the survey KYOZO2026 for admin default:wq

  # Private Waitlist Sign-Up Page

  This is a code bundle for Private Waitlist Sign-Up Page. The original project is available at https://www.figma.com/design/Ae0q4VACLpIQF5Jw2OAQ9g/Private-Waitlist-Sign-Up-Page.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  

  // sendEmail.js
const axios = require('axios');

async function sendEmail({ to, subject, html, text, from, replyTo, communityName }) {
  try {
    const response = await axios.post(
      'https://pro.kyozo.com/api/v1/email/send',
      {
        to,
        subject,
        html,
        text,
        from,
        replyTo,
        communityName
      },
      {
        headers: {
          'x-api-key': '7354598b3fb157f25ec5c015cdcb6c5340a2a6dab779465c402dfb0a27082b44',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Email sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error sending email:', error.response?.data || error.message);
    throw error;
  }
}

// Example usage
async function main() {
  try {
    await sendEmail({
      to: 'test@example.com',
      subject: 'Hello from Node.js',
      html: '<h1>Hello!</h1><p>This email was sent from Node.js.</p>'
    });
  } catch (error) {
    console.error('Failed to send email');
  }
}

main();