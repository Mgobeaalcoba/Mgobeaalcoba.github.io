import IndecPage, {
  indecMetadata,
  MissingData,
} from "@/components/recursos/indec/Page";
import IncomeDashboard from "@/components/recursos/indec/IncomeDashboard";
import { loadIndec } from "@/lib/indec/server";

export const metadata = indecMetadata(0);
export default function Page() {
  const data = loadIndec("income");
  return (
    <IndecPage index={0}>
      {data ? <IncomeDashboard data={data} /> : <MissingData />}
    </IndecPage>
  );
}
