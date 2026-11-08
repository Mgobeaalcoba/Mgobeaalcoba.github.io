import Link from "next/link";
import { ArrowRight, WifiOff } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function OfflinePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="mga-container mga-error-page">
        <span className="mga-kicker">
          <WifiOff size={16} />
          MGA / Sin conexión
        </span>
        <h1>Retomamos cuando vuelva la conexión.</h1>
        <p>
          Podés volver a una sección visitada o reintentar cuando recuperes
          internet.
        </p>
        <div className="mga-page-intro__actions">
          <a className="mga-button mga-button--lime" href="/">
            Reintentar
            <ArrowRight size={18} />
          </a>
          <Link className="mga-text-link" href="/">
            Ir al inicio
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
