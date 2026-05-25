import { getClinics } from "@/lib/clinics";
import { ClinicEditor } from "./clinic-editor";

export default async function AdminPage() {
  const clinics = await getClinics();

  return <ClinicEditor initialClinics={clinics} />;
}
