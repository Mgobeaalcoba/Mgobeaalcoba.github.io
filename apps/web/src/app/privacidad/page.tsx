import type { Metadata } from 'next';
import Link from '@/components/shared/TransitionLink';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
  title: 'Privacidad y analítica',
  description: 'Cómo MGA Tech Consulting utiliza cookies, Google Analytics y los datos enviados en formularios.',
};

export default function PrivacyPage() {
  return (
    <>
    <Navbar />
    <main id="main-content" className="signal-privacy">
      <div className="signal-privacy__eyebrow">MGA / PRIVACIDAD</div>
      <h1>Datos claros.<br /><span>Control en tus manos.</span></h1>
      <p className="signal-privacy__lead">
        Esta política explica qué información se mide, para qué se usa y cómo podés cambiar tu elección.
      </p>

      <div className="signal-privacy__grid">
        <section>
          <span>01</span><h2>Medición esencial</h2>
          <p>El sitio puede enviar señales técnicas sin cookies para conocer de forma agregada si funciona correctamente. No usamos esos datos para identificarte.</p>
        </section>
        <section>
          <span>02</span><h2>Google Analytics 4</h2>
          <p>Si aceptás analítica, medimos navegación, secciones vistas e interacciones para mejorar contenido y conversión. La elección “Analítica + Signals” habilita además funciones de medición entre dispositivos y personalización de Google.</p>
        </section>
        <section>
          <span>03</span><h2>Formularios y asistente</h2>
          <p>Nombre, email y mensajes se usan únicamente para responder la consulta y dar seguimiento comercial. No se envían como dimensiones ni parámetros a Google Analytics.</p>
        </section>
        <section>
          <span>04</span><h2>Tu elección</h2>
          <p>Podés aceptar, rechazar o modificar el consentimiento en cualquier momento desde “Cookies” en el pie de página. La preferencia queda guardada en tu navegador.</p>
        </section>
      </div>

      <p className="signal-privacy__contact">
        Consultas sobre privacidad: <a href="mailto:mariano@mgatc.com">mariano@mgatc.com</a>
      </p>
      <Link href="/" className="signal-privacy__back">← Volver al inicio</Link>
    </main>
    <Footer />
    </>
  );
}
