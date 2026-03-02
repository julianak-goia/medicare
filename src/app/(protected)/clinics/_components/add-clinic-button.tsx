"use client";

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ClinicForm from "@/app/(protected)/clinic-form/components/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AddClinicButton = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4" />
          Adicionar Clínica
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Clínica</DialogTitle>
          <DialogDescription>
            Preencha as informações para criar uma nova clínica.
          </DialogDescription>
        </DialogHeader>
        <ClinicForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default AddClinicButton;
