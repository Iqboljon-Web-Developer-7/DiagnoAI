// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // @ts-ignore
  cookies().delete('access-token');
  return NextResponse.json({ message: 'Logged out' });
}