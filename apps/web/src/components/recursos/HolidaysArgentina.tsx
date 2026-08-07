'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Holiday = {
  date: string;
  name: { es: string; en: string };
  type: 'nacional' | 'trasladable' | 'puente';
};

const HOLIDAYS_2026: Holiday[] = [
  { date: '2026-01-01', name: { es: 'Año Nuevo', en: "New Year's Day" }, type: 'nacional' },
  { date: '2026-02-16', name: { es: 'Carnaval', en: 'Carnival' }, type: 'trasladable' },
  { date: '2026-02-17', name: { es: 'Carnaval', en: 'Carnival' }, type: 'trasladable' },
  { date: '2026-03-24', name: { es: 'Día Nacional de la Memoria', en: 'National Day of Remembrance' }, type: 'nacional' },
  { date: '2026-04-02', name: { es: 'Día del Veterano y de los Caídos en Malvinas', en: 'Veterans and Fallen Day' }, type: 'nacional' },
  { date: '2026-04-03', name: { es: 'Viernes Santo', en: 'Good Friday' }, type: 'nacional' },
  { date: '2026-05-01', name: { es: 'Día del Trabajador', en: "Workers' Day" }, type: 'nacional' },
  { date: '2026-05-25', name: { es: 'Día de la Revolución de Mayo', en: 'May Revolution Day' }, type: 'nacional' },
  { date: '2026-06-15', name: { es: 'Paso a la Inmortalidad del Gral. Belgrano', en: "General Belgrano's Death Anniversary" }, type: 'trasladable' },
  { date: '2026-07-09', name: { es: 'Día de la Independencia', en: 'Independence Day' }, type: 'nacional' },
  { date: '2026-08-17', name: { es: 'Paso a la Inmortalidad del Gral. San Martín', en: "General San Martín's Death Anniversary" }, type: 'trasladable' },
  { date: '2026-10-12', name: { es: 'Día del Respeto a la Diversidad Cultural', en: 'Cultural Diversity Day' }, type: 'trasladable' },
  { date: '2026-11-20', name: { es: 'Día de la Soberanía Nacional', en: 'National Sovereignty Day' }, type: 'trasladable' },
  { date: '2026-12-08', name: { es: 'Inmaculada Concepción de María', en: 'Immaculate Conception' }, type: 'nacional' },
  { date: '2026-12-25', name: { es: 'Navidad', en: 'Christmas Day' }, type: 'nacional' },
];

const TYPE_LABELS: Record<string, { es: string; en: string; color: string }> = {
  nacional: { es: 'Nacional', en: 'National', color: 'text-sky-400 bg-sky-400/10' },
  trasladable: { es: 'Trasladable', en: 'Transferable', color: 'text-purple-400 bg-purple-400/10' },
  puente: { es: 'Puente', en: 'Bridge', color: 'text-green-400 bg-green-400/10' },
};

function formatDate(dateStr: string, lang: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  });
}

export default function HolidaysArgentina() {
  const { lang } = useLanguage();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = HOLIDAYS_2026.filter((h) => {
    const d = new Date(h.date + 'T12:00:00');
    return d >= today;
  }).slice(0, 8);

  const past = HOLIDAYS_2026.filter((h) => {
    const d = new Date(h.date + 'T12:00:00');
    return d < today;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar size={24} className="text-sky-400" />
        <div>
          <h3 className="text-lg font-bold">
            {lang === 'es' ? 'Feriados Nacionales 2026' : 'National Holidays 2026'}
          </h3>
          <p className="text-xs text-gray-400">Argentina · {lang === 'es' ? 'Calendario oficial' : 'Official calendar'}</p>
        </div>
      </div>

      {/* Upcoming */}
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-3">
          {lang === 'es' ? 'Próximos feriados' : 'Upcoming holidays'}
        </h4>
        <div className="space-y-2">
          {upcoming.map((h, i) => {
            const d = new Date(h.date + 'T12:00:00');
            const isNext = i === 0;
            const daysUntil = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const typeInfo = TYPE_LABELS[h.type];

            return (
              <motion.div
                key={h.date}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass rounded-xl px-4 py-3 flex items-center justify-between ${isNext ? 'border border-sky-500/30' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-center min-w-[3rem]">
                    <p className="text-xs text-gray-500 uppercase">{formatDate(h.date, lang).split(' ')[0]}</p>
                    <p className="text-lg font-bold text-gray-100">{d.getDate()}</p>
                    <p className="text-xs text-gray-400">{formatDate(h.date, lang).split(' ').slice(2).join(' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{h.name[lang]}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeInfo.color}`}>
                      {typeInfo[lang]}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {isNext ? (
                    <span className="text-xs text-sky-400 font-semibold">
                      {daysUntil === 0 ? (lang === 'es' ? '¡Hoy!' : 'Today!') :
                       daysUntil === 1 ? (lang === 'es' ? 'Mañana' : 'Tomorrow') :
                       `${daysUntil} ${lang === 'es' ? 'días' : 'days'}`}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">
                      {daysUntil} {lang === 'es' ? 'días' : 'days'}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="glass rounded-xl p-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">
          {lang === 'es' ? 'Tipos de feriado' : 'Holiday types'}
        </h4>
        <div className="flex flex-wrap gap-3">
          {Object.entries(TYPE_LABELS).map(([key, val]) => (
            <span key={key} className={`text-xs px-3 py-1 rounded-full font-medium ${val.color}`}>
              {val[lang as 'es' | 'en']}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
