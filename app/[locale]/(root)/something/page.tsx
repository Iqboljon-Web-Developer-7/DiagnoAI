// app/[locale]/(root)/something/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function fetcher(token: string) {
  const response = await fetch('https://api.diagnoai.uz/chats', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(
    response
  );

  if (!response.ok) {
    throw new Error('Failed to fetch protected data');
  }

  

  return response.json();
}

export default async function page({ params }: { params: { locale: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    // Redirect to login if no token
    redirect(`/${params.locale}/login`);
  }

  try {
    const data = await fetcher(token);
    return <div>{JSON.stringify(data)}</div>;
  } catch (error) {
    console.error('Fetcher error:', error);
    // redirect(`/${params.locale}/login`);
  }
}