import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/nodemailer';

export async function POST(request) {
  try {
    const { to, subject, content } = await request.json();
    
    if (!to || !subject || !content) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: to, subject, content'
      }, { status: 400 });
    }

    // Test email sending
    const result = await sendEmail(to, subject, content);
    
    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Email sent successfully' : 'Email failed to send',
      data: result
    });
    
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
