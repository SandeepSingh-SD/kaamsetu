'use client';
import { FormEvent, useEffect, useState } from 'react';
import { categories, workers } from '@/lib/data';

type RecordItem = Record<string, any>;
const storageKeys: Record<string, string> = { categories: 'kaamsetu_admin_categories', locations: 'kaamsetu_admin_locations', workers: 'kaamsetu_admin_workers', customers: 'kaamsetu_admin_customers', enquiries: 'kaamsetu_demo_enquiries', reviews: 'kaamsetu_admin_reviews' };
const titles: Record<string, string> = { workers: 'Worker management', customers: 'Customer management', categories: 'Category management', locations: 'Location management', enquiries: 'Enquiry management', reviews: 'Review moderation', settings: 'Website settings' };

export default function AdminManager({ section }: { section: string }) {
  const [items, setItems] = useState<RecordItem[]>([]);
  const [notice, setNotice] = useState('');
  const [settings, setSettings] = useState({ siteName: 'KaamSetu', contactEmail: 'hello@kaamsetu.in', city: 'Bhopal' });
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategorySubs, setEditCategorySubs] = useState('');
  const [editLocationId, setEditLocationId] = useState('');
  const [editLocation, setEditLocation] = useState({ city: '', area: '', pincode: '' });
  const key = storageKeys[section];

  useEffect(() => {
    if (section === 'settings') {
      setSettings(JSON.parse(localStorage.getItem('kaamsetu_admin_settings') || JSON.stringify({ siteName: 'KaamSetu', contactEmail: 'hello@kaamsetu.in', city: 'Bhopal' })));
      return;
    }
    if (!key) return;
    const saved = localStorage.getItem(key);
    if (saved) { setItems(JSON.parse(saved)); return; }
    const initial = section === 'categories' ? categories.map((category) => ({ ...category, active: true }))
      : section === 'workers' ? workers.map((worker) => ({ ...worker, blocked: false, verification: worker.verified ? 'approved' : 'pending' }))
      : section === 'locations' ? [{ id: 'bhopal', city: 'Bhopal', area: 'Arera Colony', pincode: '462016', active: true }, { id: 'rewa', city: 'Rewa', area: 'Civil Lines', pincode: '486001', active: true }]
      : section === 'customers' ? [JSON.parse(localStorage.getItem('kaamsetu_demo_user') || 'null')].filter(Boolean).map((user: RecordItem, index: number) => ({ ...user, id: `customer-${index}`, blocked: false }))
      : section === 'enquiries' ? JSON.parse(localStorage.getItem('kaamsetu_demo_enquiries') || '[]')
      : section === 'reviews' ? workers.map((worker, index) => ({ id: `review-${index}`, worker: worker.name, rating: worker.rating, body: 'Sample customer review for demo display.', visible: true })) : [];
    setItems(initial);
  }, [section, key]);

  function persist(next: RecordItem[]) { setItems(next); if (key) localStorage.setItem(key, JSON.stringify(next)); if (section === 'enquiries') localStorage.setItem('kaamsetu_demo_enquiries', JSON.stringify(next)); }
  function update(id: string, values: RecordItem) { persist(items.map((item) => item.id === id ? { ...item, ...values } : item)); }
  function remove(id: string) { persist(items.filter((item) => item.id !== id)); }
  function saveCategoryEdit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const name = editCategoryName.trim(); if (name.length < 2) { setNotice('Category name needs at least 2 characters.'); return; } const subs = editCategorySubs.split(',').map((value) => value.trim()).filter(Boolean); update(editCategoryId, { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), subs }); setEditCategoryId(''); setNotice('Category updated in this browser demo.'); }
  function saveLocationEdit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (editLocation.city.trim().length < 2 || editLocation.area.trim().length < 2) { setNotice('City and area need at least 2 characters.'); return; } update(editLocationId, editLocation); setEditLocationId(''); setNotice('Location updated in this browser demo.'); }

  function addCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const name = String(form.get('name') || '').trim();
    if (name.length < 2) { setNotice('Enter a category name with at least 2 characters.'); return; }
    const subs = String(form.get('subs') || '').split(',').map((value) => value.trim()).filter(Boolean);
    persist([{ id: crypto.randomUUID(), name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), icon: '🧰', subs, active: true }, ...items]); event.currentTarget.reset(); setNotice('Category added to this browser demo.');
  }
  function addLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const city = String(form.get('city') || '').trim(); const area = String(form.get('area') || '').trim(); const pincode = String(form.get('pincode') || '').trim();
    if (city.length < 2 || area.length < 2) { setNotice('Enter both city and area.'); return; }
    persist([{ id: crypto.randomUUID(), city, area, pincode, active: true }, ...items]); event.currentTarget.reset(); setNotice('Location added to this browser demo.');
  }
  function saveSettings(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); const next = { siteName: String(form.get('siteName')), contactEmail: String(form.get('contactEmail')), city: String(form.get('city')) }; localStorage.setItem('kaamsetu_admin_settings', JSON.stringify(next)); setSettings(next); setNotice('Settings saved in this browser demo.'); }

  const title = titles[section] || 'Administration';
  return <div className="container min-h-[55vh] py-12">
    <p className="eyebrow">Admin workspace · Browser demo</p><h1 className="mt-2 text-3xl font-extrabold text-navy">{title}</h1>
    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">Demo controls only. Changes are stored in this browser and do not affect a live marketplace. This area has no real admin authentication; do not use it to manage production data.</div>
    {notice && <p role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{notice}</p>}

    {section === 'categories' && <><form onSubmit={addCategory} className="card mt-5 grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto]"><label className="field"><span>Category name</span><input name="name" required minLength={2} placeholder="e.g. Solar installation"/></label><label className="field"><span>Subcategories (comma separated)</span><input name="subs" placeholder="Panels, maintenance"/></label><button className="btn btn-primary self-end">Add category</button></form><div className="mt-4 grid gap-3">{items.map((item) => <article className="card flex flex-wrap items-center justify-between gap-4 p-4" key={item.id}>{editCategoryId === item.id ? <form onSubmit={saveCategoryEdit} className="grid w-full gap-3 sm:grid-cols-[1fr_1.5fr_auto_auto]"><label className="field"><span>Category</span><input value={editCategoryName} onChange={(event) => setEditCategoryName(event.target.value)} required minLength={2}/></label><label className="field"><span>Subcategories</span><input value={editCategorySubs} onChange={(event) => setEditCategorySubs(event.target.value)} placeholder="Comma separated"/></label><button className="btn btn-primary self-end">Save</button><button type="button" className="btn btn-light self-end" onClick={() => setEditCategoryId('')}>Cancel</button></form> : <><div><h2 className="font-bold">{item.icon} {item.name}</h2><p className="mt-1 text-xs text-muted">{(item.subs || []).join(' · ') || 'No subcategories'} · {item.active ? 'Active' : 'Inactive'}</p></div><div className="flex flex-wrap gap-2"><button className="btn btn-light !px-3 !py-2 text-xs" onClick={() => { setEditCategoryId(item.id); setEditCategoryName(item.name); setEditCategorySubs((item.subs || []).join(', ')); }}>Edit</button><button className="btn btn-light !px-3 !py-2 text-xs" onClick={() => update(item.id, { active: !item.active })}>{item.active ? 'Deactivate' : 'Activate'}</button><button className="btn btn-light !px-3 !py-2 text-xs text-red-700" onClick={() => remove(item.id)}>Delete</button></div></>}</article>)}</div></>}

    {section === 'locations' && <><form onSubmit={addLocation} className="card mt-5 grid gap-3 p-4 sm:grid-cols-[1fr_1fr_1fr_auto]"><label className="field"><span>City</span><input name="city" required placeholder="City"/></label><label className="field"><span>Area</span><input name="area" required placeholder="Area"/></label><label className="field"><span>Pincode</span><input name="pincode" inputMode="numeric" maxLength={6} placeholder="Optional"/></label><button className="btn btn-primary self-end">Add location</button></form><div className="mt-4 grid gap-3">{items.map((item) => <article className="card flex flex-wrap items-center justify-between gap-4 p-4" key={item.id}>{editLocationId === item.id ? <form onSubmit={saveLocationEdit} className="grid w-full gap-3 sm:grid-cols-[1fr_1fr_1fr_auto_auto]"><label className="field"><span>City</span><input value={editLocation.city} onChange={(event) => setEditLocation({ ...editLocation, city: event.target.value })} required/></label><label className="field"><span>Area</span><input value={editLocation.area} onChange={(event) => setEditLocation({ ...editLocation, area: event.target.value })} required/></label><label className="field"><span>Pincode</span><input value={editLocation.pincode} onChange={(event) => setEditLocation({ ...editLocation, pincode: event.target.value })} inputMode="numeric" maxLength={6}/></label><button className="btn btn-primary self-end">Save</button><button type="button" className="btn btn-light self-end" onClick={() => setEditLocationId('')}>Cancel</button></form> : <><div><h2 className="font-bold">{item.area}, {item.city}</h2><p className="mt-1 text-xs text-muted">{item.pincode || 'No pincode'} · {item.active ? 'Active' : 'Inactive'}</p></div><div className="flex flex-wrap gap-2"><button className="btn btn-light !px-3 !py-2 text-xs" onClick={() => { setEditLocationId(item.id); setEditLocation({ city: item.city, area: item.area, pincode: item.pincode || '' }); }}>Edit</button><button className="btn btn-light !px-3 !py-2 text-xs" onClick={() => update(item.id, { active: !item.active })}>{item.active ? 'Deactivate' : 'Activate'}</button><button className="btn btn-light !px-3 !py-2 text-xs text-red-700" onClick={() => remove(item.id)}>Delete</button></div></>}</article>)}</div></>}

    {section === 'workers' && <div className="mt-5 grid gap-3">{items.map((item) => <article className="card flex flex-wrap items-center justify-between gap-4 p-4" key={item.id}><div><h2 className="font-bold">{item.name}</h2><p className="mt-1 text-sm text-muted">{item.category} · {item.city} · Verification: {item.verification}</p><p className="text-xs text-muted">{item.blocked ? 'Blocked' : 'Active demo profile'}</p></div><div className="flex flex-wrap gap-2"><button className="btn btn-light !px-3 !py-2 text-xs" onClick={() => update(item.id, { verification: item.verification === 'approved' ? 'rejected' : 'approved' })}>{item.verification === 'approved' ? 'Reject' : 'Approve'}</button><button className="btn btn-light !px-3 !py-2 text-xs" onClick={() => update(item.id, { blocked: !item.blocked })}>{item.blocked ? 'Unblock' : 'Block'}</button></div></article>)}</div>}

    {section === 'customers' && <div className="mt-5 grid gap-3">{items.length ? items.map((item) => <article className="card flex flex-wrap items-center justify-between gap-4 p-4" key={item.id}><div><h2 className="font-bold">{item.name}</h2><p className="mt-1 text-sm text-muted">{item.city} · {item.email || 'No email'}</p></div><button className="btn btn-light !px-3 !py-2 text-xs" onClick={() => update(item.id, { blocked: !item.blocked })}>{item.blocked ? 'Unblock' : 'Block'}</button></article>) : <p className="card p-6 text-muted">No demo customer profile saved in this browser.</p>}</div>}

    {section === 'enquiries' && <div className="mt-5 grid gap-3">{items.length ? items.map((item) => <article className="card p-4" key={item.id}><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-bold">{item.category} · {item.location}</h2><p className="mt-1 text-sm text-muted">{item.description}</p></div><span className="pill !bg-amber-50 !text-amber-900">{item.status}</span></div><label className="field mt-3 max-w-xs"><span>Update status</span><select value={item.status} onChange={(event) => update(item.id, { status: event.target.value })}>{['New','Viewed','Accepted','Rejected','In Discussion','Confirmed','Completed','Cancelled'].map((status) => <option key={status}>{status}</option>)}</select></label></article>) : <p className="card p-6 text-muted">No browser demo enquiries yet.</p>}</div>}

    {section === 'reviews' && <div className="mt-5 grid gap-3">{items.map((item) => <article className="card flex flex-wrap items-center justify-between gap-4 p-4" key={item.id}><div><h2 className="font-bold">{item.worker} · ★ {item.rating}</h2><p className="mt-1 text-sm text-muted">{item.body}</p></div><button className="btn btn-light !px-3 !py-2 text-xs" onClick={() => update(item.id, { visible: !item.visible })}>{item.visible ? 'Hide review' : 'Restore review'}</button></article>)}</div>}

    {section === 'settings' && <form onSubmit={saveSettings} className="card mt-5 grid max-w-2xl gap-4 p-5"><label className="field"><span>Website name</span><input name="siteName" defaultValue={settings.siteName}/></label><label className="field"><span>Contact email</span><input name="contactEmail" type="email" defaultValue={settings.contactEmail}/></label><label className="field"><span>Launch city</span><input name="city" defaultValue={settings.city}/></label><button className="btn btn-primary justify-self-start">Save demo settings</button></form>}
  </div>;
}
