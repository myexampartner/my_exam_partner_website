import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = '123456';

export async function GET(request) {
  try {
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'No token provided',
        hasCookie: !!request.cookies.get('auth-token'),
        hasAuthHeader: !!request.headers.get('authorization')
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    return NextResponse.json({
      success: true,
      message: 'Token is valid',
      decoded,
      hasCookie: !!request.cookies.get('auth-token'),
      hasAuthHeader: !!request.headers.get('authorization')
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Token verification failed',
      error: error.message,
      hasCookie: !!request.cookies.get('auth-token'),
      hasAuthHeader: !!request.headers.get('authorization')
    });
  }
}
