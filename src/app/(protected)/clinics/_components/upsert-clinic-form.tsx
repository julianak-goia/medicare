"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useEffect, useState } from "react";
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
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clinicsTable } from "@/db/schema";

import { medicalSpecialties } from "../../doctors/_constants";
import {
  clinicInsurancePlans,
  clinicNatures,
  clinicTypes,
} from "../_constants";
import {
  type AddressData,
  fetchAddressByZipCode,
  formatPhone,
  formatZipCode,
} from "../_helpers/zip-code";

interface UpsertClinicFormProps {
  clinic?: typeof clinicsTable.$inferSelect;
  onSuccess?: () => void;
}

const UpsertClinicForm = ({ clinic, onSuccess }: UpsertClinicFormProps) => {
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const form = useForm<UpsertClinicSchema>({
    resolver: zodResolver(upsertClinicSchema),
    defaultValues: {
      id: clinic?.id,
      name: clinic?.name ?? "",
      type: clinic?.type ?? "",
      nature:
        (clinic?.nature as "Público" | "Privado" | undefined) ?? undefined,
      services: clinic?.services ?? [],
      acceptedInsurancePlans: clinic?.acceptedInsurancePlans ?? [],
      phone: clinic?.phone ?? "",
      email: clinic?.email ?? "",
      zipCode: clinic?.zipCode ?? "",
      address: clinic?.address ?? "",
      number: clinic?.number ?? "",
      city: clinic?.city ?? "",
      state: clinic?.state ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      id: clinic?.id,
      name: clinic?.name ?? "",
      type: clinic?.type ?? "",
      nature:
        (clinic?.nature as "Público" | "Privado" | undefined) ?? undefined,
      services: clinic?.services ?? [],
      acceptedInsurancePlans: clinic?.acceptedInsurancePlans ?? [],
      phone: clinic?.phone ?? "",
      email: clinic?.email ?? "",
      zipCode: clinic?.zipCode ?? "",
      address: clinic?.address ?? "",
      number: clinic?.number ?? "",
      city: clinic?.city ?? "",
      state: clinic?.state ?? "",
    });
  }, [clinic, form]);

  const handleZipCodeChange = useCallback(
    (value: string) => {
      const formatted = formatZipCode(value);
      form.setValue("zipCode", formatted);

      if (formatted.replace(/\D/g, "").length === 8) {
        setIsLoadingAddress(true);
        fetchAddressByZipCode(formatted)
          .then((addressData: AddressData | null) => {
            if (addressData) {
              form.setValue("address", addressData.address);
              form.setValue("city", addressData.city);
              form.setValue("state", addressData.state);
            } else {
              toast.error("CEP não encontrado");
            }
          })
          .finally(() => setIsLoadingAddress(false));
      }
    },
    [form],
  );

  const handlePhoneChange = useCallback(
    (value: string) => {
      const formatted = formatPhone(value);
      form.setValue("phone", formatted);
    },
    [form],
  );

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
    <DialogContent className="max-h-[90vh] overflow-y-auto">
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

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de clínica</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {clinicTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Natureza</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a natureza" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {clinicNatures.map((nature) => (
                        <SelectItem key={nature.value} value={nature.value}>
                          {nature.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="services"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serviços</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={medicalSpecialties}
                    value={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Selecione um ou mais serviços"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceptedInsurancePlans"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Convênios aceitos</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={clinicInsurancePlans}
                    value={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Selecione um ou mais convênios"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(00) 00000-0000"
                    {...field}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@exemplo.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input
                    placeholder="00000-000"
                    {...field}
                    onChange={(e) => handleZipCodeChange(e.target.value)}
                    disabled={isLoadingAddress}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input placeholder="Rua/Avenida" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input placeholder="123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="UF" {...field} maxLength={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={upsertClinicAction.isPending || isLoadingAddress}
            >
              {(upsertClinicAction.isPending || isLoadingAddress) && (
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
