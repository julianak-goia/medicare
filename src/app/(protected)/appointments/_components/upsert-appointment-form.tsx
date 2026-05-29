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
import {
  appointmentsTable,
  clinicsTable,
  doctorsTable,
  patientsTable,
} from "@/db/schema";

type DoctorWithClinics = typeof doctorsTable.$inferSelect & {
  doctorsToClinics: {
    clinic: typeof clinicsTable.$inferSelect;
  }[];
};

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

  clinicId: z.string().uuid({
    message: "Clínica é obrigatória.",
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
  doctors: DoctorWithClinics[];
  clinicId: string;
  appointment?: Appointment;
  onSuccess?: () => void;
}

const UpsertAppointmentForm = ({
  patients,
  doctors,
  clinicId,
  appointment,
  onSuccess,
}: UpsertAppointmentFormProps) => {
  const isEditing = Boolean(appointment);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: appointment?.patientId ?? "",
      doctorId: appointment?.doctorId ?? "",
      clinicId: appointment?.clinicId ?? clinicId,
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
  const selectedClinicId = useWatch({
    control: form.control,
    name: "clinicId",
  });

  const patientsForClinic = useMemo(
    () => patients.filter((p) => p.clinicId === selectedClinicId),
    [patients, selectedClinicId],
  );

  const selectedDateString = selectedDate
    ? dayjs(selectedDate).format("YYYY-MM-DD")
    : undefined;

  const { data: availableTimes } = useQuery({
    queryKey: ["available-times", selectedDateString, selectedDoctorId],
    queryFn: async () =>
      getAvailableTimes({
        date: selectedDateString!,
        doctorId: selectedDoctorId,
      }),
    enabled: !!selectedDate && !!selectedDoctorId,
  });

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor.id === selectedDoctorId),
    [doctors, selectedDoctorId],
  );

  const selectedDoctorClinics = useMemo(
    () =>
      selectedDoctor
        ? selectedDoctor.doctorsToClinics
            .map((doctorClinic) => doctorClinic.clinic)
            .filter(
              (clinic, index, clinics) =>
                clinics.findIndex((item) => item.id === clinic.id) === index,
            )
        : [],
    [selectedDoctor],
  );

  useEffect(() => {
    if (!appointment) {
      return;
    }

    form.reset({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      clinicId: appointment.clinicId,
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
  }, [form, selectedClinicId, selectedDoctor, selectedDoctorClinics]);

  useEffect(() => {
    if (!selectedPatientId) return;
    const exists = patientsForClinic.some((p) => p.id === selectedPatientId);
    if (!exists) {
      form.setValue("patientId", "");
    }
  }, [selectedPatientId, patientsForClinic, form]);

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
      date: dayjs(values.date).format("YYYY-MM-DD"),
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

  const isDateAvailable = (date: Date) => {
    if (!selectedDoctorId) return false;
    const selectedDoctor = doctors.find(
      (doctor) => doctor.id === selectedDoctorId,
    );
    if (!selectedDoctor) return false;
    const dayOfWeek = date.getDay();

    return (
      dayOfWeek >= selectedDoctor?.availableFromWeekDay &&
      dayOfWeek <= selectedDoctor?.availableToWeekDay
    );
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
                    {patientsForClinic.map((patient) => (
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
            name="clinicId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clínica</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedDoctor}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma clínica" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedDoctorClinics.map((clinic) => (
                      <SelectItem key={clinic.id} value={clinic.id}>
                        {clinic.name}
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
                      disabled={(date) =>
                        date < new Date() || !isDateAvailable(date)
                      }
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
                    {availableTimes?.data?.map((time) => (
                      <SelectItem
                        key={time.value}
                        value={time.value}
                        disabled={!time.available}
                      >
                        {time.label} {!time.available && "(indisponivel)"}
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
