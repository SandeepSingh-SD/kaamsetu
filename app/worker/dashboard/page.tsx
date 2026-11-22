'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function WorkerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => { setUser(JSON.parse(localStorage.getItem('kaamsetu_demo_user') || 'null')); setCount(JSON.parse(localStorage.getItem('kaamsetu_demo_enquiries') || '[]').filter((item: any) => ['New', 'Accepted', 'In Discussion'].includes(item.status)).length); setReady(true); }, []);
  if (!ready) return <div className="container min-h-[55vh] py-12"><p role="status" className="text-muted">Loading your demo dashboard…</p></div>;
  return <div className="bg-cream py-12"><div className="container min-h-[55vh]"><p className="eyebrow">Worker dashboard · Demo</p><h1 className="mt-2 text-3xl font-extrabold text-navy">Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!</h1><p className="mt-2 text-muted">Manage your demo worker presence. This profile is stored only in this browser.</p><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['Profile', 'Complete your worker details', '/worker/profile'], ['Enquiries', `${count} active demo enquiries`, '/worker/enquiries'], ['Portfolio', 'Sample portfolio slots', '/worker/portfolio'], ['Find customers', 'Browse local directory', '/find-workers']].map(([title, detail, href]) => <Link className="card p-5 transition hover:-translate-y-1 hover:shadow-soft" href={href} key={title}><h2 className="font-bold text-navy">{title}</h2><p className="mt-2 text-sm text-muted">{detail}</p></Link>)}</div><Link href="/worker/enquiries" className="btn btn-primary mt-6">Review enquiries</Link><div className="mt-6 rounded-xl bg-orange/10 p-4 text-sm leading-6 text-[#8b4a20]">Demo changes stay in this browser. Live worker enquiries, profile publishing, OTP and verification require Supabase configuration.</div></div></div>;
}
