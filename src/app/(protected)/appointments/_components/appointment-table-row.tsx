"use client";

import { format } from "date-fns";
import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
import { formatCurrencyInCents } from "@/helpers/currency";

import UpsertAppointmentForm from "./upsert-appointment-form";

interface AppointmentTableRowProps {
  appointment: typeof appointmentsTable.$inferSelect & {
    patient: typeof patientsTable.$inferSelect;
    doctor: typeof doctorsTable.$inferSelect;
  };
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
}

const AppointmentTableRow = ({
  appointment,
  patients,
  doctors,
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
        {format(appointment.date, "dd/MM/yyyy 'às' HH:mm")}
      </td>
      <td className="text-muted-foreground px-4 py-3">
        {formatCurrencyInCents(appointment.appointmentPriceInCents)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(event) => event.preventDefault()}
                    >
                      <PencilIcon className="h-4 w-4" />
                      Editar agendamento
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={(event) => event.preventDefault()}
                    >
                      <TrashIcon className="h-4 w-4" />
                      Excluir agendamento
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>

              <UpsertAppointmentForm
                appointment={appointment}
                doctors={doctors}
                patients={patients}
                onSuccess={() => setIsEditDialogOpen(false)}
              />

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir agendamento</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir o agendamento de{" "}
                    <strong>{appointment.patient.name}</strong> com{" "}
                    <strong>{appointment.doctor.name}</strong>? Essa ação não
                    pode ser desfeita.
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
          </Dialog>
        </div>
      </td>
    </tr>
  );
};

export default AppointmentTableRow;
