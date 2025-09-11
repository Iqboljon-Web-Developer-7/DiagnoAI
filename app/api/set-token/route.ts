import { NextRequest } from "next/server";

// pages/api/set-token.js
export async function GET(req:NextRequest) {
  return new Response(JSON.stringify({ message: 'Method not allowed' }), {
    status: 405,
  });
}

export async function POST(req:NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return new Response(JSON.stringify({ message: 'Token is required' }), {
        status: 400,
      });
    }

    // Set HTTP-only cookie with dynamic attribute name
    const response = new Response(JSON.stringify({ message: 'Value stored' }), {
      status: 200,
    });

    response.headers.set(
      'Set-Cookie',
      `token=${token}; HttpOnly; Secure=${
        process.env.NODE_ENV === 'production'
      }; SameSite=Strict; Path=/; Max-Age=${24 * 60 * 60}`
    );
 
    return response;
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Invalid request body' }), {
      status: 400,
    });
  }
}