export async function sendEmail(
  receiver: string,
  subject: string,
  body: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ receiver, subject, body }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, message: error.message || 'Failed to send email' };
    }

    return { success: true, message: 'Email sent successfully' };
  } catch (error: any) {
    return { success: false, message: error.message || 'An error occurred' };
  }
}
