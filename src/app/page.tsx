import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/wireless-scanner');
  return null;
}
