import { redirect } from 'next/navigation';

// /priem и /priem/proczedura бяха две почти еднакви страници — остава една.
export default function PriemPage() {
  redirect('/priem/proczedura');
}
