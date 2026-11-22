'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => { setUser(JSON.parse(localStorage.getItem('kaamsetu_demo_user') || 'null')); setCount(JSON.parse(localStorage.getItem('kaamsetu_demo_enquiries') || '[]').length); setReady(true); }, []);
  if (!ready) return <div className="container min-h-[55vh] py-12"><p role="status" className="text-muted">Loading your demo dashboard…</p></div>;
  return <div className="bg-cream py-12"><div className="container min-h-[55vh]"><p className="eyebrow">Customer dashboard · Demo</p><h1 className="mt-2 text-3xl font-extrabold text-navy">Namaste{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!</h1><p className="mt-2 text-muted">Your demo account data stays in this browser.</p><div className="mt-8 grid gap-4 sm:grid-cols-3"><DashCard title="My enquiries" value={String(count)} note="Browser-only records" href="/customer/enquiries"/><DashCard title="Find workers" value="Browse directory" note="22 service categories" href="/find-workers"/><DashCard title="My profile" value={user?.city || 'Set up profile'} note="Edit your demo details" href="/customer/profile"/></div><Link className="btn btn-primary mt-6" href="/post-requirement">Post a requirement</Link></div></div>;
}
function DashCard({ title, value, note, href }: { title: string; value: string; note: string; href: string }) { return <Link href={href} className="card p-5 transition hover:-translate-y-1 hover:shadow-soft"><p className="text-sm text-muted">{title}</p><p className="mt-2 text-xl font-extrabold text-navy">{value}</p><p className="mt-1 text-xs text-muted">{note}</p></Link>; }
