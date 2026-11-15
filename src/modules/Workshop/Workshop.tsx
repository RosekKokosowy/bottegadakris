import { PageHeader } from "@/components/PageHeader/PageHeader";
import { TrainingMain } from "@/components/TrainingMain/TrainingMain";
import { log } from "@/lib/trace.inc";
import { getWorkshopById } from "@/lib/workshop.inc";
import { IWorkshopPage } from "./workshops.data";

export default async function Workshop({ data }: { data: IWorkshopPage }) {
  const { workshopId, title, trainingMain } = data;
  let cena = trainingMain.details.cena;

  // The current price lives in the database (editable in /olimp/prices); the static text is the fallback.
  if (workshopId) {
    try {
      const workshop = await getWorkshopById(workshopId);
      if (workshop) cena = `${workshop.cena} zł`;
    } catch (error) {
      log("Workshop", error, `Failed to load price of workshop ${workshopId}, showing the static price.`);
    }
  }

  return (
    <>
      <PageHeader title={title} />
      <TrainingMain {...trainingMain} details={{ ...trainingMain.details, cena }} />
    </>
  );
}
