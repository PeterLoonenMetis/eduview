import { getAcademies } from "@/lib/db/institutes";
import { MBOWizardForm } from "./mbo-wizard-form";

export default async function NieuweMBOOpleidingPage() {
  const academies = await getAcademies();

  return <MBOWizardForm academies={academies} />;
}
