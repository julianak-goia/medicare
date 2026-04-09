import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ClinicForm from "./components/form";
const ClinicFormPage = () => {
  return (
    <div>
      <Dialog open={true}>
        <DialogContent
          contentWidth="60vw"
          contentHeight="80vh"
          contentMaxWidth="60vw"
          className="overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Adicionar clínica</DialogTitle>
            <DialogDescription>
              Adicione uma clínica para continuar.
            </DialogDescription>
          </DialogHeader>
          <ClinicForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClinicFormPage;
