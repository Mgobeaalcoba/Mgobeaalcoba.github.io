import { RecursosDataProvider } from '@/contexts/RecursosDataContext';
import './indec.css';

export default function RecursosLayout({ children }: { children: React.ReactNode }) {
  return <RecursosDataProvider>{children}</RecursosDataProvider>;
}
