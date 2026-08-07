'use client';

import { FilterProvider } from '@/contexts/FilterContext';
import Experience from './Experience';
import Projects from './Projects';
import Education from './Education';
import Skills from './Skills';

export default function FilteredPortfolioSections() {
  return (
    <FilterProvider>
      <Experience />
      <Projects />
      <Education />
      <Skills />
    </FilterProvider>
  );
}
