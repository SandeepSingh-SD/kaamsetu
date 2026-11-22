'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { categories, workers } from '@/lib/data';
import WorkerCard from '@/components/WorkerCard';

type Filters = { category: string; area: string; query: string; experience: string; rate: string; rating: string; availability: string };
const emptyFilters: Filters = { category: '', area: '', query: '', experience: '', rate: '', rating: '', availability: '' };

export default function WorkerSearch({ initialCategory, initialArea }: { initialCategory: string; initialArea: string }) {
  const [draft, setDraft] = useState<Filters>({ ...emptyFilters, category: initialCategory, area: initialArea });
  const [filters, setFilters] = useState<Filters>({ ...emptyFilters, category: initialCategory, area: initialArea });
  const [searched, setSearched] = useState(true);
  function change(name: keyof Filters, value: string) { setDraft((current) => ({ ...current, [name]: value })); }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setFilters(draft); setSearched(true); }
  function reset() { setDraft(emptyFilters); setFilters(emptyFilters); setSearched(false); }
  const list = useMemo(() => workers.filter((worker) => {
    const location = `${worker.area} ${worker.city} ${worker.pincode}`.toLowerCase();
    const text = `${worker.name} ${worker.category} ${worker.skills.join(' ')}`.toLowerCase();
    return (!filters.category || worker.category.toLowerCase() === filters.category.toLowerCase())
      && (!filters.area || location.includes(filters.area.toLowerCase()))
      && (!filters.query || text.includes(filters.query.toLowerCase()))
      && (!filters.rate || worker.rate <= Number(filters.rate))
      && (!filters.experience || worker.experience >= Number(filters.experience))
      && (!filters.rating || worker.rating >= Number(filters.rating))
      && (!filters.availability || worker.availability === filters.availability);
  }), [filters]);

  return <div className="bg-cream py-10"><div className="container">
    <p className="eyebrow">Local skills, one search away</p><h1 className="mt-2 text-4xl font-extrabold text-navy">Find workers across India</h1><p className="mt-2 text-muted">Search across India, or enter a city, area or pincode to narrow your results.</p>
    <form onSubmit={submit} className="mt-7 grid gap-3 rounded-2xl border border-line bg-white p-4 shadow-soft md:grid-cols-[1fr_1fr_1fr_auto]">
      <div className="field"><label htmlFor="filter-category">Work category</label><select id="filter-category" value={draft.category} onChange={(event) => change('category', event.target.value)}><option value="">All categories</option>{categories.map((category) => <option key={category.slug}>{category.name}</option>)}</select></div>
      <div className="field"><label htmlFor="filter-area">City, area or pincode</label><input id="filter-area" value={draft.area} onChange={(event) => change('area', event.target.value)} placeholder="All India or e.g. Arera Colony"/></div>
      <div className="field"><label htmlFor="filter-query">Worker, category or skill</label><input id="filter-query" value={draft.query} onChange={(event) => change('query', event.target.value)} placeholder="What do you need?"/></div>
      <button type="submit" className="btn btn-primary self-end"><Search size={17}/> Search</button>
      <div className="field"><label htmlFor="filter-exp">Min. experience</label><select id="filter-exp" value={draft.experience} onChange={(event) => change('experience', event.target.value)}><option value="">Any experience</option><option value="5">5+ years</option><option value="10">10+ years</option></select></div>
      <div className="field"><label htmlFor="filter-rate">Max daily rate</label><select id="filter-rate" value={draft.rate} onChange={(event) => change('rate', event.target.value)}><option value="">Any rate</option><option value="700">Up to ₹700</option><option value="900">Up to ₹900</option><option value="1200">Up to ₹1,200</option></select></div>
      <div className="field"><label htmlFor="filter-rating">Minimum rating</label><select id="filter-rating" value={draft.rating} onChange={(event) => change('rating', event.target.value)}><option value="">Any rating</option><option value="4">4+ stars</option><option value="4.5">4.5+ stars</option><option value="4.8">4.8+ stars</option></select></div>
      <div className="field"><label htmlFor="filter-availability">Availability</label><select id="filter-availability" value={draft.availability} onChange={(event) => change('availability', event.target.value)}><option value="">Any status</option><option>Available</option><option>Busy</option></select></div>
    </form>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-muted"><span className="flex items-center gap-2"><SlidersHorizontal size={16}/>{searched ? `${list.length} worker profiles` : 'Set filters and search'}</span>{searched && <button onClick={reset} className="font-bold text-orange">Clear filters</button>}</div>
    {searched && list.length > 0 && <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((worker) => <WorkerCard key={worker.id} worker={worker}/>)}</div>}
    {searched && list.length === 0 && <div className="card mt-5 py-16 text-center"><div className="text-4xl">🔎</div><h2 className="mt-4 text-xl font-bold">No workers match these filters</h2><p className="mt-2 text-sm text-muted">Try another area, pincode or category.</p><button className="btn btn-light mt-5" onClick={reset}>Clear filters</button></div>}
    <p className="mt-8 text-center text-xs text-muted">Demo directory · Sample profiles and rates, not live listings</p>
  </div></div>;
}
