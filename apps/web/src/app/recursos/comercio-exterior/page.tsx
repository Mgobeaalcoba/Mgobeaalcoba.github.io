import IndecPage, {
  indecMetadata,
  MissingData,
} from "@/components/recursos/indec/Page";
import TradeDashboard from "@/components/recursos/indec/TradeDashboard";
import { loadIndec } from "@/lib/indec/server";

export const metadata = indecMetadata(2);
export default function Page() {
  const data = loadIndec("trade");
  return (
    <IndecPage index={2}>
      {data ? <TradeDashboard data={data} /> : <MissingData />}
    </IndecPage>
  );
}
