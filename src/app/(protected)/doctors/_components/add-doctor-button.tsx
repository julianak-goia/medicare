"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { clinicsTable } from "@/db/schema";

import UpsertDoctorForm from "./upsert-doctor-form";

interface AddDoctorButtonProps {
  clinics: (typeof clinicsTable.$inferSelect)[];
}

const AddDoctorButton = ({ clinics }: AddDoctorButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar médico
        </Button>
      </DialogTrigger>
      <UpsertDoctorForm clinics={clinics} onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
};

export default AddDoctorButton;
