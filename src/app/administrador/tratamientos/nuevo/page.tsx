"use client";

import Layout from "@/components/layouts/Layout";
import FormTratamiento from "@/components/domain/administrador/FormTratamiento";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function NuevoTratamientoPage() {
  const { isAuthenticated, loading } = useAuthGuard({ allowedRoles: ['administrador'] });

  if (loading || !isAuthenticated) return null;

  return (
      <div className="p-6 max-w-3xl mx-auto">
        <FormTratamiento />
      </div>
  );
}