import AdminManager from '@/components/AdminManager';

const sections = ['workers', 'customers', 'categories', 'locations', 'enquiries', 'reviews', 'settings'];
export function generateStaticParams() { return sections.map((section) => ({ section })); }
export default function AdminSection({ params }: { params: { section: string } }) {
  if (!sections.includes(params.section)) return <div className="container py-12"><h1 className="text-2xl font-bold">Admin section not found</h1></div>;
  return <AdminManager section={params.section} />;
}
