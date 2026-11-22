import Link from 'next/link';
import { HardHat } from 'lucide-react';

const navItems = [
  ['Home', '/'],
  ['Find Workers', '/find-workers'],
  ['Categories', '/categories'],
  ['How It Works', '/#how'],
] as const;
const mobileNavItems = [
  ['Home', '/'],
  ['Workers', '/find-workers'],
  ['Categories', '/categories'],
  ['How it works', '/#how'],
] as const;

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="container flex h-[68px] items-center justify-between gap-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-orange"><HardHat size={22}/></span>
          <span className="font-[Manrope] text-[20px] font-extrabold tracking-tight text-navy">kaam<span className="text-orange">setu</span><small className="ml-2 hidden align-middle font-sans text-[9px] font-semibold tracking-normal text-muted sm:inline">HAR KAAM KA SAATHI</small></span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-5 text-[13px] font-semibold text-[#475467] lg:flex xl:gap-7">
          {navItems.map(([label, href]) => <Link key={label} href={href} className="whitespace-nowrap hover:text-orange">{label}</Link>)}
        </nav>
        <Link href="/login" className="shrink-0 rounded-lg px-3 py-2 text-sm font-bold text-navy hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange">Log in</Link>
      </div>
      <nav aria-label="Mobile navigation" className="mobile-nav-scroll flex gap-1 overflow-x-auto border-t border-line px-3 py-2 text-xs font-semibold text-[#475467] lg:hidden">
        {mobileNavItems.map(([label, href]) => <Link key={label} href={href} className="shrink-0 whitespace-nowrap rounded-lg px-2.5 py-2 hover:bg-cream hover:text-orange">{label}</Link>)}
      </nav>
    </header>
  );
}
