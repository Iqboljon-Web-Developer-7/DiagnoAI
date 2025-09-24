import { NextRequest } from "next/server";
import { cookies } from "next/headers";

// pages/api/set-token.js
export async function GET(req: NextRequest) {
  return new Response(JSON.stringify({ message: 'Method not allowed' }), {
    status: 405,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, role } = body;

    if (!token) {
      return new Response(JSON.stringify({ message: 'Token is required' }), {
        status: 400,
      });
    }

    if (!role || typeof role !== 'string') {
      return new Response(JSON.stringify({ message: 'Role is required and must be a string' }), {
        status: 400,
      });
    }

    const response = new Response(JSON.stringify({ message: 'Value stored' }), {
      status: 200,
    });

    (await cookies()).set('access-token', token, {
      httpOnly: true, // Inaccessible to JS
      secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
      sameSite: 'strict', // CSRF protection
      maxAge: 60 * 60 * 24 * 4, // 4 days expiry
      path: '/',
    });

    // Set role cookie
    (await cookies()).set('role', role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 4,
      path: '/',
    });

    return response;
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Invalid request body' }), {
      status: 400,
    });
  }
}