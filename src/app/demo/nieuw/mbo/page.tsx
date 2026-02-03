import { getAcademies } from "@/lib/db/institutes";
import { MBOWizardForm } from "./mbo-wizard-form";

export const dynamic = "force-dynamic";

export default async function NieuweMBOOpleidingPage() {
  const academies = await getAcademies();

  // Cast to the expected type (include institute relation)
  const academiesWithInstitute = academies.map(a => ({
    id: a.id,
    name: a.name,
    code: a.code,
    instituteId: a.instituteId,
    institute: a.institute,
  }));

  return <MBOWizardForm academies={academiesWithInstitute} />;
}
