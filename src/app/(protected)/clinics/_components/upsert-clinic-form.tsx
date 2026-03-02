"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { upsertClinic } from "@/actions/upsert-clinic";
import {
  UpsertClinicSchema,
  upsertClinicSchema,
} from "@/actions/upsert-clinic/schema";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { clinicsTable } from "@/db/schema";

interface UpsertClinicFormProps {
  clinic?: typeof clinicsTable.$inferSelect;
  onSuccess?: () => void;
}

const UpsertClinicForm = ({ clinic, onSuccess }: UpsertClinicFormProps) => {
  const form = useForm<UpsertClinicSchema>({
    resolver: zodResolver(upsertClinicSchema),
    defaultValues: {
      id: clinic?.id,
      name: clinic?.name ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      id: clinic?.id,
      name: clinic?.name ?? "",
    });
  }, [clinic, form]);

  const upsertClinicAction = useAction(upsertClinic, {
    onSuccess: () => {
      toast.success(
        clinic
          ? "Clínica atualizada com sucesso."
          : "Clínica criada com sucesso.",
      );
      onSuccess?.();
    },
    onError: () => {
      toast.error(
        clinic ? "Erro ao atualizar clínica." : "Erro ao criar clínica.",
      );
    },
  });

  const onSubmit = (values: UpsertClinicSchema) => {
    upsertClinicAction.execute(values);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{clinic ? "Editar clínica" : "Nova clínica"}</DialogTitle>
        <DialogDescription>
          {clinic
            ? "Edite as informações dessa clínica."
            : "Preencha as informações para criar uma nova clínica."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da clínica" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit" disabled={upsertClinicAction.isPending}>
              {upsertClinicAction.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {clinic ? "Salvar alterações" : "Criar clínica"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertClinicForm;
