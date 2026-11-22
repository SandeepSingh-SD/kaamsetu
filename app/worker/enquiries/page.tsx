'use client';
import { useEffect, useState } from 'react';

type Enquiry = { id: string; workerId?: string; category: string; description: string; location: string; date: string; status: string };
const statuses = ['New', 'Viewed', 'Accepted', 'Rejected', 'In Discussion', 'Confirmed', 'Completed', 'Cancelled'];

export default function WorkerEnquiries() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [workerCategory, setWorkerCategory] = useState('');
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('kaamsetu_demo_user') || 'null');
    setWorkerCategory(user?.category || '');
    setItems(JSON.parse(localStorage.getItem('kaamsetu_demo_enquiries') || '[]'));
  }, []);
  const relevant = items.filter((item) => !item.workerId || !workerCategory || item.category === workerCategory);
  function update(id: string, status: string) {
    const next = items.map((item) => item.id === id ? { ...item, status } : item);
    setItems(next); localStorage.setItem('kaamsetu_demo_enquiries', JSON.stringify(next));
  }
  return <div className="container min-h-[55vh] py-12"><p className="eyebrow">Worker dashboard · Demo</p><h1 className="mt-2 text-3xl font-extrabold">Customer enquiries</h1><p className="mt-2 text-sm text-muted">Shared browser demo only · Changing status does not notify a real customer.</p>
    {relevant.length ? <div className="mt-6 grid gap-3">{relevant.map((item) => <article className="card p-5" key={item.id}><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-bold">{item.category}</h2><p className="mt-1 text-sm text-muted">{item.location} · Preferred {item.date}</p></div><span className="pill !bg-amber-50 !text-amber-900">{item.status}</span></div><p className="mt-3 text-sm leading-6">{item.description}</p><div className="mt-4 flex flex-wrap gap-2">{item.status === 'New' && <><button className="btn btn-primary !py-2 text-xs" onClick={() => update(item.id, 'Accepted')}>Accept enquiry</button><button className="btn btn-light !py-2 text-xs" onClick={() => update(item.id, 'Rejected')}>Decline</button></>}{item.status === 'Accepted' && <button className="btn btn-dark !py-2 text-xs" onClick={() => update(item.id, 'In Discussion')}>Start discussion</button>}{item.status === 'In Discussion' && <button className="btn btn-dark !py-2 text-xs" onClick={() => update(item.id, 'Confirmed')}>Confirm work</button>}{item.status === 'Confirmed' && <button className="btn btn-dark !py-2 text-xs" onClick={() => update(item.id, 'Completed')}>Mark completed</button>}</div></article>)}</div> : <div className="card mt-6 p-7 text-center"><h2 className="font-bold">No demo enquiries yet</h2><p className="mt-2 text-sm text-muted">Post a sample enquiry as a customer in this browser to exercise the response flow.</p><a className="btn btn-primary mt-4" href="/post-requirement">Create demo enquiry</a></div>}
  </div>;
}
