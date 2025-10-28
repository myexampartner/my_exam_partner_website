import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if environment variables are loaded
    const envCheck = {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER ? 'Set' : 'Not Set',
      SMTP_PASS: process.env.SMTP_PASS ? 'Set' : 'Not Set',
      SMTP_FROM_NAME: process.env.SMTP_FROM_NAME,
      SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
    };

    return NextResponse.json({
      success: true,
      message: 'Environment variables check',
      data: envCheck
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
