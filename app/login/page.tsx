'use client';
import type { Metadata } from 'next';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setUser(JSON.parse(localStorage.getItem('kaamsetu_demo_user') || 'null')); setReady(true); }, []);
  const dashboard = user?.role === 'worker' ? '/worker/dashboard' : '/customer/dashboard';
  return <div className="container grid min-h-[65vh] max-w-4xl items-center gap-8 py-12 md:grid-cols-2"><div><p className="eyebrow">Welcome back</p><h1 className="mt-3 text-4xl font-extrabold text-navy">Kaam aage badhayein.</h1><p className="mt-4 leading-7 text-muted">Demo sign-in uses a profile saved in this browser. Live OTP authentication is not configured.</p></div><div className="card p-6" aria-live="polite">{!ready ? <><div className="h-6 w-52 animate-pulse rounded bg-cream"/><p className="mt-3 text-sm text-muted">Checking this browser’s demo profile…</p></> : user ? <><h2 className="text-xl font-extrabold">Namaste, {user.name}</h2><p className="mt-2 text-sm text-muted">Demo profile found on this browser.</p><Link href={dashboard} className="btn btn-primary mt-5">Continue to dashboard</Link><button className="btn btn-light ml-2 mt-5" onClick={() => { localStorage.removeItem('kaamsetu_demo_user'); setUser(null); }}>Sign out</button></> : <><h2 className="text-xl font-extrabold">No demo profile found</h2><p className="mt-2 text-sm leading-6 text-muted">Create a demo profile first. It stays in this browser and is not a secure account.</p><div className="mt-5 flex flex-wrap gap-2"><Link href="/register" className="btn btn-primary">Join as a customer</Link><Link href="/register?role=worker" className="btn btn-dark">Join as a worker</Link></div></>}</div></div>;
}
