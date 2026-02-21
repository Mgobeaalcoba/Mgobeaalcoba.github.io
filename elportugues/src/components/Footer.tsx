import type { Footer as FooterData, Brand } from '@/types/content';

interface FooterProps {
  data: FooterData;
  brand: Brand;
}

export default function Footer({ data, brand }: FooterProps) {
  return (
    <footer className="bg-[#0B1120] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={brand.logoFooter}
              alt={brand.name}
              className="h-8 w-auto object-contain opacity-80"
            />
            <div>
              <div className="text-white font-bold text-sm">{brand.legalName}</div>
              <div className="text-slate-500 text-xs">Desde {brand.founded}</div>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {data.links.map((link) => (
              <a
                key={link.anchor}
                href={link.anchor}
                className="text-slate-400 hover:text-[#0CC1C1] transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ISO Badge */}
          <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-[#0CC1C1] animate-pulse" />
            <span className="text-xs text-slate-400">ISO 9001:2015 Certificado</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-500 text-xs">{data.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
