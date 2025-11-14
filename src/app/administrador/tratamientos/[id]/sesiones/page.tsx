"use client";

import { useParams } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import FormSesiones from "@/components/domain/administrador/FormSesiones";


export default function ProgramarSesionesPage() {
  const { id } = useParams();
  const { isAuthenticated, loading } = useAuthGuard({ allowedRoles: ['administrador'] });

  if (loading || !isAuthenticated) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <FormSesiones tratamientoId={id as string} />
    </div>
  );
}