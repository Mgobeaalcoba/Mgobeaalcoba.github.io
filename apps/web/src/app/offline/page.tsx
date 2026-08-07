import Link from 'next/link';
import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <main id="main-content" className="signal-offline-page">
      <div>
        <span><WifiOff size={26} /></span>
        <p>MGA / OFFLINE</p>
        <h1>Estás sin conexión.</h1>
        <p>Podés volver a una sección visitada o reintentar cuando recuperes internet.</p>
        <div><Link href="/">Ir al inicio</Link><a href="/">Reintentar</a></div>
      </div>
    </main>
  );
}
