import type { Metadata } from 'next';
import WorkerSearch from '@/components/WorkerSearch';

export const metadata: Metadata = { title: 'Find Local Workers', description: 'Search and compare local worker profiles by category, area, rate, experience, rating and availability.' };
export default function FindWorkersPage({ searchParams }: { searchParams: { category?: string; area?: string } }) {
  return <WorkerSearch initialCategory={searchParams.category || ''} initialArea={searchParams.area || ''} />;
}
