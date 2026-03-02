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
import { usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddClinicButton from "./_components/add-clinic-button";

const ClinicsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }

  const userClinics = await db.query.usersToClinicsTable.findMany({
    where: eq(usersToClinicsTable.userId, session.user.id),
    with: {
      clinic: true,
    },
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Clínicas</PageTitle>
          <PageDescription>
            Gerencie as clínicas cadastradas no sistema
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddClinicButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                  Nome
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                  Data de criação
                </th>
              </tr>
            </thead>
            <tbody>
              {userClinics.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="text-muted-foreground px-4 py-8 text-center"
                  >
                    Nenhuma clínica encontrada.
                  </td>
                </tr>
              ) : (
                userClinics.map(({ clinic }) => (
                  <tr
                    key={clinic.id}
                    className="hover:bg-muted/30 border-b transition-colors last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium">{clinic.name}</td>
                    <td className="text-muted-foreground px-4 py-3">
                      {new Intl.DateTimeFormat("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }).format(new Date(clinic.createdAt))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default ClinicsPage;
