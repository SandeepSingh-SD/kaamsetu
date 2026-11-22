import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Star, Briefcase, Phone, MessageCircle, CheckCircle2 } from 'lucide-react';
import { workers, categories } from '@/lib/data';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return workers.map((worker) => ({ id: worker.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const worker = workers.find((item) => item.id === params.id);
  return worker ? { title: `${worker.category} in ${worker.area}, ${worker.city} | ${worker.name}`, description: `View the demo profile, skills, indicative rates and contact options for ${worker.name}, a ${worker.category.toLowerCase()} in ${worker.area}, ${worker.city}.` } : { title: 'Worker profile' };
}

export default function WorkerProfile({ params }: { params: { id: string } }) {
  const worker = workers.find((item) => item.id === params.id);
  if (!worker) notFound();

  const whatsappUrl = `https://wa.me/${worker.phone}?text=${encodeURIComponent(
    'Hello, I found your profile on KaamSetu. I need your service. Please share your availability and charges.'
  )}`;
  const category = categories.find((item) => item.name === worker.category);
  const skills = [...worker.skills, ...(category?.subs.slice(0, 3) ?? [])];

  return (
    <div className="bg-cream py-10">
      <div className="container grid gap-6 lg:grid-cols-[1fr_330px]">
        <div className="card overflow-hidden">
          <div className="relative h-64 bg-[#e6e9ed] sm:h-80">
            <img src={worker.image} alt="Illustrative demo worker profile" className="h-full w-full object-cover object-top" />
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold">{worker.category}</span>
              {worker.verified && <span className="pill"><CheckCircle2 size={13} /> Demo verified badge</span>}
            </div>
            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-navy">{worker.name}</h1>
                <p className="mt-2 flex items-center gap-1 text-sm text-muted"><MapPin size={15} />{worker.area}, {worker.city}</p>
              </div>
              <span className="flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-2 font-bold"><Star size={16} className="fill-amber-400 text-amber-400" />{worker.rating} <span className="font-normal text-muted">({worker.reviews} reviews)</span></span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-cream p-4 sm:grid-cols-3">
              <div><p className="text-xs text-muted">Experience</p><p className="mt-1 font-bold">{worker.experience} years</p></div>
              <div><p className="text-xs text-muted">Daily rate</p><p className="mt-1 font-bold">₹{worker.rate} / day</p></div>
              <div><p className="text-xs text-muted">Availability</p><p className="mt-1 font-bold text-green-700">{worker.availability}</p></div>
            </div>
            <h2 className="mt-8 text-xl font-extrabold">About {worker.name.split(' ')[0]}</h2>
            <p className="mt-2 leading-7 text-muted">{worker.about}</p>
            <h2 className="mt-7 text-xl font-extrabold">Skills &amp; services</h2>
            <div className="mt-3 flex flex-wrap gap-2">{skills.map((skill) => <span className="rounded-full border border-line px-3 py-2 text-sm" key={skill}>{skill}</span>)}</div>
            <h2 className="mt-8 text-xl font-extrabold">Work portfolio <span className="text-sm font-medium text-muted">(demo)</span></h2>
            <div className="mt-3 grid grid-cols-3 gap-3">{[0, 1, 2].map((item) => <div key={item} className="grid aspect-square place-items-center rounded-xl bg-cream text-center text-xs text-muted">Portfolio photos<br />coming soon</div>)}</div>
            <h2 className="mt-8 text-xl font-extrabold">Customer reviews</h2>
            <div className="mt-3 rounded-xl border border-line p-4">
              <div className="flex items-center gap-1 text-sm font-bold"><Star size={15} className="fill-amber-400 text-amber-400" /> 5.0 · Sample review</div>
              <p className="mt-2 text-sm leading-6 text-muted">“Very professional and completed the work on time. Would recommend.”</p>
              <p className="mt-2 text-xs text-muted">KaamSetu demo content</p>
            </div>
          </div>
        </div>
        <aside className="card h-fit p-5 lg:sticky lg:top-24">
          <p className="text-sm text-muted">Indicative daily charges</p>
          <p className="mt-1 text-3xl font-extrabold text-navy">₹{worker.rate}<span className="text-sm font-normal text-muted"> / day</span></p>
          <p className="mt-2 text-xs text-muted">Confirm the final scope and pricing directly with the worker.</p>
          <a className="btn btn-dark mt-5 w-full" href={`tel:+${worker.phone}`}><Phone size={17} /> Call Now</a>
          <a className="btn mt-2 w-full bg-[#25d366] text-white" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a>
          <Link className="btn btn-primary mt-2 w-full" href={`/post-requirement?worker=${worker.id}`}>Send Enquiry</Link>
          <div className="mt-5 rounded-xl bg-cream p-3 text-xs leading-5 text-muted">Demo listing. Contact actions use sample numbers and do not represent active workers.</div>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted"><Briefcase size={14} />{worker.experience} years experience</p>
        </aside>
      </div>
    </div>
  );
}
