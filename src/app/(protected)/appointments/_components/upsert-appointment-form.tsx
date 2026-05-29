"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import dayjs from "dayjs";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { createAppointment } from "@/actions/create-appointment";
import { getAvailableTimes } from "@/actions/get-available-times";
import { updateAppointment } from "@/actions/update-appointment";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

const formSchema = z.object({
  patientId: z.string().min(1, {
    message: "Paciente é obrigatório.",
  }),

  doctorId: z.string().min(1, {
    message: "Médico é obrigatório.",
  }),

  appointmentPrice: z.number().min(1, {
    message: "Valor da consulta é obrigatório.",
  }),

  date: z.date({
    message: "Data é obrigatória.",
  }),

  time: z.string().min(1, {
    message: "Horário é obrigatório.",
  }),
});

type AppointmentFormValues = z.infer<typeof formSchema>;
type Appointment = typeof appointmentsTable.$inferSelect;

interface UpsertAppointmentFormProps {
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
  appointment?: Appointment;
  onSuccess?: () => void;
}

const UpsertAppointmentForm = ({
  patients,
  doctors,
  appointment,
  onSuccess,
}: UpsertAppointmentFormProps) => {
  const isEditing = Boolean(appointment);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: appointment?.patientId ?? "",
      doctorId: appointment?.doctorId ?? "",
      date: appointment?.date,
      time: appointment?.date
        ? format(appointment.date, "HH:mm:ss")
        : undefined,
      appointmentPrice: appointment
        ? appointment.appointmentPriceInCents / 100
        : 0,
    },
  });

  const selectedDoctorId = useWatch({
    control: form.control,
    name: "doctorId",
  });
  const selectedPatientId = useWatch({
    control: form.control,
    name: "patientId",
  });
  const selectedDate = useWatch({
    control: form.control,
    name: "date",
  });

  const selectedDateString = selectedDate
    ? dayjs(selectedDate).format("YYYY-MM-DD")
    : undefined;

  const { data: availableTimes } = useQuery({
    queryKey: ["available-times", selectedDateString, selectedDoctorId],
    enabled: Boolean(selectedDateString && selectedDoctorId),
    queryFn: async () =>
      getAvailableTimes({
        date: selectedDateString!,
        doctorId: selectedDoctorId,
      }),
  });

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor.id === selectedDoctorId),
    [doctors, selectedDoctorId],
  );

  useEffect(() => {
    if (!appointment) {
      return;
    }

    form.reset({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      date: appointment.date,
      time: format(appointment.date, "HH:mm:ss"),
      appointmentPrice: appointment.appointmentPriceInCents / 100,
    });
  }, [appointment, form]);

  const canSelectDate = Boolean(selectedDoctorId && selectedPatientId);

  useEffect(() => {
    if (selectedDoctor) {
      form.setValue(
        "appointmentPrice",
        selectedDoctor.appointmentPriceInCents / 100,
      );
      return;
    }

    form.setValue("appointmentPrice", 0);
  }, [form, selectedDoctor]);

  const createAppointmentAction = useAction(createAppointment, {
    onSuccess: () => {
      toast.success("Agendamento criado com sucesso.");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao criar agendamento.");
    },
  });

  const updateAppointmentAction = useAction(updateAppointment, {
    onSuccess: () => {
      toast.success("Agendamento atualizado com sucesso.");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao atualizar agendamento.");
    },
  });

  const onSubmit = (values: AppointmentFormValues) => {
    const payload = {
      ...values,
      date: values.date.toISOString(),
      time: values.time || undefined,
    };

    if (appointment) {
      updateAppointmentAction.execute({
        id: appointment.id,
        ...payload,
      });
      return;
    }

    createAppointmentAction.execute(payload);
  };

  const isSubmitting =
    createAppointmentAction.status === "executing" ||
    updateAppointmentAction.status === "executing";

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Editar agendamento" : "Novo agendamento"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Atualize os dados do agendamento selecionado."
            : "Preencha os dados para criar um novo agendamento."}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médico</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um médico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da consulta</FormLabel>
                <NumericFormat
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value.floatValue ?? 0);
                  }}
                  decimalScale={2}
                  fixedDecimalScale
                  decimalSeparator=","
                  allowNegative={false}
                  allowLeadingZeros={false}
                  thousandSeparator="."
                  customInput={Input}
                  prefix="R$"
                  disabled={!selectedDoctor}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!field.value}
                      className="data-[empty=true]:text-muted-foreground w-70 justify-start text-left font-normal"
                      disabled={!canSelectDate}
                    >
                      <CalendarIcon />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                  disabled={!canSelectDate || !selectedDate}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sem opções disponíveis" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-60">
                    {availableTimes?.data
                      ?.filter((time) => time.available)
                      .map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              {isEditing ? "Salvar alterações" : "Criar agendamento"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertAppointmentForm;
