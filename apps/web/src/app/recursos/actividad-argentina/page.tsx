import IndecPage, {
  indecMetadata,
  MissingData,
} from "@/components/recursos/indec/Page";
import ActivityDashboard from "@/components/recursos/indec/ActivityDashboard";
import { loadIndec } from "@/lib/indec/server";

export const metadata = indecMetadata(1);
export default function Page() {
  const data = loadIndec("activity");
  return (
    <IndecPage index={1}>
      {data ? <ActivityDashboard data={data} /> : <MissingData />}
    </IndecPage>
  );
}
