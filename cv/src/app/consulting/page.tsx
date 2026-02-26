'use client';

import { useEffect } from 'react';

export default function ConsultingRedirect() {
  useEffect(() => {
    window.location.replace('/');
  }, []);
  return null;
}
