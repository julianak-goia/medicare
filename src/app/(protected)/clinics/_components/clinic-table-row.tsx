"use client";

import { PencilIcon, TrashIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deleteClinic } from "@/actions/delete-clinic";
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
import { clinicsTable } from "@/db/schema";

import UpsertClinicForm from "./upsert-clinic-form";

interface ClinicTableRowProps {
  clinic: typeof clinicsTable.$inferSelect;
}

const ClinicTableRow = ({ clinic }: ClinicTableRowProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const deleteClinicAction = useAction(deleteClinic, {
    onSuccess: () => {
      toast.success("Clínica excluída com sucesso.");
    },
    onError: () => {
      toast.error("Erro ao excluir clínica.");
    },
  });

  const handleDeleteClick = () => {
    deleteClinicAction.execute({ id: clinic.id });
  };

  return (
    <tr className="hover:bg-muted/30 border-b transition-colors last:border-b-0">
      <td className="px-4 py-3 font-medium">{clinic.name}</td>
      <td className="text-muted-foreground px-4 py-3">
        {new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(clinic.createdAt))}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <PencilIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <UpsertClinicForm
              clinic={clinic}
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
                <AlertDialogTitle>Excluir clínica</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir a clínica{" "}
                  <strong>{clinic.name}</strong>? Essa ação não pode ser
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

export default ClinicTableRow;
