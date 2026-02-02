import { getAcademies } from "@/lib/db/institutes";
import { HBOWizardForm } from "./hbo-wizard-form";

export default async function NieuweHBOOpleidingPage() {
  const academies = await getAcademies();

  return <HBOWizardForm academies={academies} />;
}
