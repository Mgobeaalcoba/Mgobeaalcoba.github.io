import { RecursosDataProvider } from '@/contexts/RecursosDataContext';

export default function RecursosLayout({ children }: { children: React.ReactNode }) {
  return <RecursosDataProvider>{children}</RecursosDataProvider>;
}
