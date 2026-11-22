'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BriefcaseBusiness, ClipboardList, MapPinned, Users, Wrench } from 'lucide-react';
import { categories, workers } from '@/lib/data';

const areas = [
  { title: 'Workers', href: '/admin/workers', icon: BriefcaseBusiness, detail: 'Review demo profiles and verification state' },
  { title: 'Customers', href: '/admin/customers', icon: Users, detail: 'Manage this browser’s demo customer profile' },
  { title: 'Categories', href: '/admin/categories', icon: Wrench, detail: 'Add, deactivate or remove categories' },
  { title: 'Locations', href: '/admin/locations', icon: MapPinned, detail: 'Edit demo areas and pincodes' },
  { title: 'Enquiries', href: '/admin/enquiries', icon: ClipboardList, detail: 'Track and update demo enquiry status' },
  { title: 'Reviews', href: '/admin/reviews', icon: ClipboardList, detail: 'Hide or restore sample review cards' },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ customers: 0, enquiries: 0 });
  useEffect(() => { setCounts({ customers: localStorage.getItem('kaamsetu_demo_user') ? 1 : 0, enquiries: JSON.parse(localStorage.getItem('kaamsetu_demo_enquiries') || '[]').length }); }, []);
  const metrics = [['Workers', workers.length, 'Sample directory'], ['Customers', counts.customers, 'Local demo profiles'], ['Enquiries', counts.enquiries, 'Browser-only records'], ['Categories', categories.length, 'Built-in categories']];
  return <div className="bg-cream py-10"><div className="container"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Administration</p><h1 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">Marketplace overview</h1><p className="mt-2 text-sm text-muted">Local browser demo workspace</p></div><span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-orange">DEMO MODE</span></div>
    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">This dashboard has no real admin login or server-side authorization. Changes are local to this browser and never update production data. Secure admin access must be configured before launch.</div>
    <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">{metrics.map(([name, value, note]) => <div className="card p-5" key={String(name)}><p className="text-sm text-muted">{name}</p><p className="mt-2 text-3xl font-extrabold text-navy">{value}</p><p className="mt-1 text-xs text-muted">{note}</p></div>)}</div>
    <div className="mt-9 flex items-end justify-between"><div><p className="eyebrow">Workspace</p><h2 className="mt-1 text-2xl font-extrabold text-navy">Manage marketplace data</h2></div><span className="hidden text-xs text-muted sm:inline">Changes save to this browser</span></div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{areas.map(({ title, href, icon: Icon, detail }) => <Link className="card group p-5 transition hover:-translate-y-1 hover:shadow-soft" href={href} key={href}><div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-cream text-orange"><Icon size={20}/></span><ArrowUpRight size={17} className="text-muted transition group-hover:text-orange"/></div><h3 className="mt-4 font-extrabold text-navy">{title}</h3><p className="mt-1 text-sm text-muted">{detail}</p></Link>)}</div>
  </div></div>;
}
