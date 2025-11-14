"use client";

import Layout from "@/components/layouts/Layout";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function AdministradorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuthGuard({
    allowedRoles: ['administrador']
  });

  if (loading || !isAuthenticated) {
    return null;
  }

  return <Layout>{children}</Layout>;
}