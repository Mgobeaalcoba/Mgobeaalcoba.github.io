'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
  activeTag: string;
  setActiveTag: (tag: string) => void;
}

const FilterContext = createContext<FilterContextType>({
  activeTag: 'all',
  setActiveTag: () => {},
});

export function FilterProvider({ children }: { children: ReactNode }) {
  const [activeTag, setActiveTag] = useState<string>('all');
  return (
    <FilterContext.Provider value={{ activeTag, setActiveTag }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  return useContext(FilterContext);
}
