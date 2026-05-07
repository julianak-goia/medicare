import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { patientsTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddPatientButton from "./_components/add-patient-button";

const PatientsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }
  if (!session.user.clinic) {
    redirect("/clinic-form");
  }

  const [patients, userClinics] = await Promise.all([
    db.query.patientsTable.findMany({
      where: eq(patientsTable.clinicId, session.user.clinic.id),
    }),
    db.query.usersToClinicsTable.findMany({
      where: eq(usersToClinicsTable.userId, session.user.id),
      with: { clinic: true },
    }),
  ]);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Pacientes</PageTitle>
          <PageDescription>
            Gerencie os pacientes da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddPatientButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="grid grid-cols-3 gap-4">
          {patients.map((p) => (
            <div key={p.id} className="rounded-md border p-4">
              <p className="font-medium">{p.name}</p>
              <p className="text-sm">{p.email}</p>
              <p className="text-sm">{p.phoneNumber}</p>
              <p className="text-sm">
                {p.sex === "male" ? "Masculino" : "Feminino"}
              </p>
            </div>
          ))}
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default PatientsPage;
