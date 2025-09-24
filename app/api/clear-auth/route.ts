import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  (await cookies()).delete('access-token');
  (await cookies()).delete('role');
  return NextResponse.json({ message: 'Logged out' });
}