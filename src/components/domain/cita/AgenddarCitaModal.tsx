"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import FormCita from "./CitaForm";

export default function AgendarCitaModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-full text-sm font-medium transition">
          <CalendarPlus className="w-4 h-4" />
          Agendar cita
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-700">
            Agendar nueva cita
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <FormCita/>
        </div>
      </DialogContent>
    </Dialog>
  );
}

