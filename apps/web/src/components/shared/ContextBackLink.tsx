import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ContextBackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link className="signal-context-back" href={href}>
      <ArrowLeft aria-hidden="true" size={16} />
      <span>{label}</span>
    </Link>
  );
}
