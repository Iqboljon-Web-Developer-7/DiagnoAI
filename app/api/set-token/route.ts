import { cookies } from "next/headers";
import { NextRequest } from "next/server";

// pages/api/set-token.js
export async function GET(req: NextRequest) {
  return new Response(JSON.stringify({ message: 'Method not allowed' }), {
    status: 405,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return new Response(JSON.stringify({ message: 'Token is required' }), {
        status: 400,
      });
    }

    const response = new Response(JSON.stringify({ message: 'Value stored' }), {
      status: 200,
    });

    cookies().set('access-token', token, {
      httpOnly: true, // Inaccessible to JS
      secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
      sameSite: 'strict', // CSRF protection
      maxAge: 60 * 60, // 1 hour expiry
      path: '/',
    });

    return response;
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Invalid request body' }), {
      status: 400,
    });
  }
}