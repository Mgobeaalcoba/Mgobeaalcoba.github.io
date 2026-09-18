'use client';

import { useEffect } from 'react';
import { events } from '@/lib/gtag';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator) || process.env.NODE_ENV !== 'production') return;

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        events.serviceWorkerLifecycle('registered', 'success');
        if (registration.waiting) events.serviceWorkerLifecycle('update_waiting', 'success');
        registration.addEventListener('updatefound', () => {
          events.serviceWorkerLifecycle('update_found', 'success');
          registration.installing?.addEventListener('statechange', () => {
            events.serviceWorkerLifecycle('installing_state_change', 'success');
          });
        });
      })
      .catch(() => events.serviceWorkerLifecycle('registered', 'error'));

    // A new worker taking control means the next navigation serves fresh assets.
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      events.serviceWorkerLifecycle('controller_change', 'success');
    });
  }, []);

  return null;
}
