'use client';

import { FormEvent, useState } from 'react';
import { z } from 'zod';
import { categories } from '@/lib/data';

const registrationSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10 digit Indian mobile number'),
  email: z.union([z.string().email('Enter a valid email'), z.literal('')]).optional(),
  role: z.enum(['customer', 'worker']),
  city: z.string().trim().min(2, 'Enter your city'),
  category: z.string().optional(),
});

const enquirySchema = z.object({
  category: z.string().min(1, 'Select a work category'),
  description: z.string().trim().min(15, 'Please add a little more detail (15 characters minimum)'),
  location: z.string().trim().min(2, 'Enter the work location'),
  date: z.string().min(1, 'Choose a preferred date').refine((date) => date >= new Date().toISOString().slice(0, 10), 'Choose today or a future date'),
  budget: z.string().optional().refine((value) => !value || (Number.isFinite(Number(value)) && Number(value) >= 0), 'Budget must be zero or higher'),
  duration: z.string().optional(),
});

type Errors = Record<string, string>;

function fieldErrors(error: z.ZodError): Errors {
  return Object.fromEntries(error.issues.map((issue) => [String(issue.path[0]), issue.message]));
}
function withoutError(errors: Errors, name: string): Errors { const next = { ...errors }; delete next[name]; return next; }

export function RegisterForm({ role = 'customer' }: { role?: string }) {
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const selectedRole = role === 'worker' ? 'worker' : 'customer';

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parsed = registrationSchema.safeParse({
      name: formData.get('name'), phone: formData.get('phone'), email: formData.get('email') || '',
      role: selectedRole, city: formData.get('city'), category: formData.get('category') || '',
    });
    if (!parsed.success) { setErrors(fieldErrors(parsed.error)); return; }
    localStorage.setItem('kaamsetu_demo_user', JSON.stringify({ ...parsed.data, createdAt: new Date().toISOString() }));
    setDone(true);
  }

  if (done) return <div className="rounded-2xl border border-green-200 bg-green-50 p-5"><h2 className="font-bold text-green-900">Demo profile created</h2><p className="mt-2 text-sm leading-6 text-green-800">Details are stored in this browser only. Phone OTP is not enabled in demo mode.</p><a className="btn btn-dark mt-4" href={selectedRole === 'worker' ? '/worker/dashboard' : '/customer/dashboard'}>Go to demo dashboard</a></div>;

  return <form onSubmit={submit} noValidate className="grid gap-4">
    <div className="field"><label htmlFor="register-name">Full name</label><input id="register-name" name="name" autoComplete="name" placeholder="Your name" aria-invalid={!!errors.name} onChange={() => setErrors((current) => withoutError(current, 'name'))}/>{errors.name && <small role="alert" className="text-red-600">{errors.name}</small>}</div>
    <div className="field"><label htmlFor="register-phone">Mobile number</label><div className="flex rounded-lg border border-[#d9dde5]"><span className="border-r px-3 py-3 text-sm text-muted">+91</span><input id="register-phone" className="!border-0" name="phone" autoComplete="tel-national" inputMode="numeric" maxLength={10} placeholder="10 digit mobile number" aria-invalid={!!errors.phone} onChange={() => setErrors((current) => withoutError(current, 'phone'))}/></div>{errors.phone && <small role="alert" className="text-red-600">{errors.phone}</small>}</div>
    <div className="field"><label htmlFor="register-email">Email <span className="font-normal text-muted">(optional)</span></label><input id="register-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} onChange={() => setErrors((current) => withoutError(current, 'email'))}/>{errors.email && <small role="alert" className="text-red-600">{errors.email}</small>}</div>
    {selectedRole === 'worker' && <div className="field"><label htmlFor="register-category">Primary work category</label><select id="register-category" name="category" defaultValue=""><option value="">Choose a category</option>{categories.map((category) => <option key={category.slug}>{category.name}</option>)}</select></div>}
    <div className="field"><label htmlFor="register-city">City</label><input id="register-city" name="city" autoComplete="address-level2" defaultValue="Bhopal" placeholder="Your city" aria-invalid={!!errors.city} onChange={() => setErrors((current) => withoutError(current, 'city'))}/>{errors.city && <small role="alert" className="text-red-600">{errors.city}</small>}</div>
    <button className="btn btn-primary mt-1" type="submit">Create demo profile</button>
    <p className="text-center text-xs leading-5 text-muted">Demo mode · No OTP is sent, and this form does not create a live account.</p>
  </form>;
}

export function EnquiryForm({ workerId = '', category = '' }: { workerId?: string; category?: string }) {
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parsed = enquirySchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) { setErrors(fieldErrors(parsed.error)); return; }
    const entries = JSON.parse(localStorage.getItem('kaamsetu_demo_enquiries') || '[]');
    entries.unshift({ ...parsed.data, workerId, id: crypto.randomUUID(), status: 'New', createdAt: new Date().toISOString() });
    localStorage.setItem('kaamsetu_demo_enquiries', JSON.stringify(entries));
    setDone(true);
  }

  if (done) return <div className="rounded-xl bg-green-50 p-5 text-green-900"><h2 className="font-bold">Enquiry saved in demo mode</h2><p className="mt-2 text-sm">Saved in this browser. It is now visible in the demo worker dashboard and has not been sent to a real worker.</p><a className="btn btn-dark mt-4" href="/customer/enquiries">View demo enquiries</a></div>;

  return <form onSubmit={submit} noValidate className="grid gap-4">
    <div className="field"><label htmlFor="enquiry-category">Work category</label><select id="enquiry-category" name="category" defaultValue={category} aria-invalid={!!errors.category} onChange={() => setErrors((current) => withoutError(current, 'category'))}><option value="">Choose a category</option>{categories.map((category) => <option key={category.slug}>{category.name}</option>)}</select>{errors.category && <small role="alert" className="text-red-600">{errors.category}</small>}</div>
    <div className="field"><label htmlFor="enquiry-description">Describe the work</label><textarea id="enquiry-description" name="description" rows={4} placeholder="What needs to be done? Include useful details." aria-invalid={!!errors.description} onChange={() => setErrors((current) => withoutError(current, 'description'))}/>{errors.description && <small role="alert" className="text-red-600">{errors.description}</small>}</div>
    <div className="field"><label htmlFor="enquiry-location">Work location</label><input id="enquiry-location" name="location" defaultValue="Bhopal" placeholder="Area, city or pincode" aria-invalid={!!errors.location} onChange={() => setErrors((current) => withoutError(current, 'location'))}/>{errors.location && <small role="alert" className="text-red-600">{errors.location}</small>}</div>
    <div className="grid gap-4 sm:grid-cols-2"><div className="field"><label htmlFor="enquiry-date">Preferred date</label><input id="enquiry-date" type="date" name="date" aria-invalid={!!errors.date} onChange={() => setErrors((current) => withoutError(current, 'date'))}/>{errors.date && <small role="alert" className="text-red-600">{errors.date}</small>}</div><div className="field"><label htmlFor="enquiry-budget">Estimated budget <span className="font-normal text-muted">(optional)</span></label><input id="enquiry-budget" name="budget" type="number" min="0" placeholder="₹"/></div></div>
    <div className="field"><label htmlFor="enquiry-duration">Work duration <span className="font-normal text-muted">(optional)</span></label><input id="enquiry-duration" name="duration" placeholder="e.g. 2 days"/></div>
    <button className="btn btn-primary" type="submit">Save demo enquiry</button><p className="text-center text-xs leading-5 text-muted">Demo mode · The enquiry is browser-local and not delivered outside this browser.</p>
  </form>;
}
