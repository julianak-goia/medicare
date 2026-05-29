"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { clinicsTable, doctorsTable, patientsTable } from "@/db/schema";

import UpsertAppointmentForm from "./upsert-appointment-form";

type DoctorWithClinics = typeof doctorsTable.$inferSelect & {
  doctorsToClinics: {
    clinic: typeof clinicsTable.$inferSelect;
  }[];
};

interface AddAppointmentButtonProps {
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: DoctorWithClinics[];
  clinicId: string;
}

const AddAppointmentButton = ({
  patients,
  doctors,
  clinicId,
}: AddAppointmentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Novo agendamento
        </Button>
      </DialogTrigger>
      <UpsertAppointmentForm
        patients={patients}
        doctors={doctors}
        clinicId={clinicId}
        onSuccess={() => setIsOpen(false)}
      />
    </Dialog>
  );
};

export default AddAppointmentButton;
