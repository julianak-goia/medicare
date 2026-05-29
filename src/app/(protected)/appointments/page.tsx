import { desc, eq } from "drizzle-orm";
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
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddAppointmentButton from "./_components/add-appointment-button";
import AppointmentTableRow from "./_components/appointment-table-row";

const AppointmentsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session.user.clinic?.id) {
    redirect("/clinic-form");
  }

  const [patients, doctors, appointments] = await Promise.all([
    db.query.patientsTable.findMany({
      where: eq(patientsTable.clinicId, session.user.clinic.id),
    }),
    db.query.doctorsTable.findMany({
      where: eq(doctorsTable.clinicId, session.user.clinic.id),
    }),
    db.query.appointmentsTable.findMany({
      where: eq(appointmentsTable.clinicId, session.user.clinic.id),
      with: {
        patient: true,
        doctor: true,
      },
      orderBy: [desc(appointmentsTable.date)],
    }),
  ]);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Crie novos agendamentos para pacientes da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddAppointmentButton patients={patients} doctors={doctors} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                  Paciente
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                  Médico
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                  Data
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                  Valor
                </th>
                <th className="text-muted-foreground px-4 py-3 text-right font-medium">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-muted-foreground px-4 py-8 text-center"
                  >
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <AppointmentTableRow
                    key={appointment.id}
                    appointment={appointment}
                    patients={patients}
                    doctors={doctors}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default AppointmentsPage;
