"use client";

import { format } from "date-fns";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deleteAppointment } from "@/actions/delete-appointment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  appointmentsTable,
  clinicsTable,
  doctorsTable,
  patientsTable,
} from "@/db/schema";
import { formatCurrencyInCents } from "@/helpers/currency";

import UpsertAppointmentForm from "./upsert-appointment-form";

type DoctorWithClinics = typeof doctorsTable.$inferSelect & {
  doctorsToClinics: {
    clinic: typeof clinicsTable.$inferSelect;
  }[];
};

interface AppointmentTableRowProps {
  appointment: typeof appointmentsTable.$inferSelect & {
    clinic: typeof clinicsTable.$inferSelect;
    patient: typeof patientsTable.$inferSelect;
    doctor: typeof doctorsTable.$inferSelect;
  };
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: DoctorWithClinics[];
  clinicId: string;
}

const AppointmentTableRow = ({
  appointment,
  patients,
  doctors,
  clinicId,
}: AppointmentTableRowProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const deleteAppointmentAction = useAction(deleteAppointment, {
    onSuccess: () => {
      toast.success("Agendamento excluído com sucesso.");
    },
    onError: () => {
      toast.error("Erro ao excluir agendamento.");
    },
  });

  const handleDeleteClick = () => {
    deleteAppointmentAction.execute({ id: appointment.id });
  };

  return (
    <tr className="hover:bg-muted/30 border-b transition-colors last:border-b-0">
      <td className="px-4 py-3 font-medium">{appointment.patient.name}</td>
      <td className="text-muted-foreground px-4 py-3">
        {appointment.doctor.name}
      </td>
      <td className="text-muted-foreground px-4 py-3">
        {appointment.doctor.specialty}
      </td>
      <td className="text-muted-foreground px-4 py-3">
        {appointment.clinic.name}
      </td>
      <td className="text-muted-foreground px-4 py-3">
        {format(appointment.date, "dd/MM/yyyy 'às' HH:mm")}
      </td>
      <td className="text-muted-foreground px-4 py-3">
        {formatCurrencyInCents(appointment.appointmentPriceInCents)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <PencilIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <UpsertAppointmentForm
              appointment={appointment}
              doctors={doctors}
              patients={patients}
              clinicId={clinicId}
              onSuccess={() => setIsEditDialogOpen(false)}
            />
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <TrashIcon className="text-destructive h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir agendamento</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir o agendamento de{" "}
                  <strong>{appointment.patient.name}</strong> com{" "}
                  <strong>{appointment.doctor.name}</strong>? Essa ação não pode
                  ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteClick}>
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </td>
    </tr>
  );
};

export default AppointmentTableRow;
