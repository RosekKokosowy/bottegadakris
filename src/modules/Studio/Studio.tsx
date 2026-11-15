import { Animation } from "@/components/Animation/Animation";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { ServicesTable } from "@/components/ServicesTable/ServicesTable";
import { StudioHead } from "@/components/StudioHead/StudioHead";

export default function Studio() {
  return (
    <>
      <PageHeader title="PRACOWNIA" />
      <div className="py-12 md:py-36">
        <Animation>
          <StudioHead />
        </Animation>
        <Animation>
          <ServicesTable />
        </Animation>
      </div>
    </>
  );
}
