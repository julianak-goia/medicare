"use client";

import { PencilIcon, TrashIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deletePatient } from "@/actions/delete-patient";
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
import { patientsTable } from "@/db/schema";

import UpsertPatientForm from "./upsert-patient-form";

interface PatientTableRowProps {
  patient: typeof patientsTable.$inferSelect;
}

const PatientTableRow = ({ patient }: PatientTableRowProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const deletePatientAction = useAction(deletePatient, {
    onSuccess: () => {
      toast.success("Paciente excluído com sucesso.");
    },
    onError: () => {
      toast.error("Erro ao excluir paciente.");
    },
  });

  const handleDeleteClick = () => {
    deletePatientAction.execute({ id: patient.id });
  };

  return (
    <tr className="hover:bg-muted/30 border-b transition-colors last:border-b-0">
      <td className="px-4 py-3 font-medium">{patient.name}</td>
      <td className="text-muted-foreground px-4 py-3">{patient.email}</td>
      <td className="text-muted-foreground px-4 py-3">{patient.phoneNumber}</td>
      <td className="text-muted-foreground px-4 py-3">
        {patient.sex === "male" ? "Masculino" : "Feminino"}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <PencilIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <UpsertPatientForm
              patient={patient}
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
                <AlertDialogTitle>Excluir paciente</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir o paciente{" "}
                  <strong>{patient.name}</strong>? Essa ação não pode ser
                  desfeita.
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

export default PatientTableRow;
