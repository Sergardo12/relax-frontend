// components/domain/suscripcion/PagoSuscripcionModal.tsx

"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { MembresiaResponse } from "@/types";
import { suscripcionService } from "@/services/api";
import { useAuthStore } from "@/lib/store/auth.store";
import { toast } from "sonner";
import { CulqiSuscripcionButton } from "./CulquiSuscripcionButton";


interface Props {
  membresia: MembresiaResponse;
  idPaciente: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PagoSuscripcionModal({ membresia, idPaciente, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [suscripcionId, setSuscripcionId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const { usuario } = useAuthStore();

  // 🔥 Obtener email automáticamente
  useEffect(() => {
    if (usuario?.correo) {
      setEmail(usuario.correo);
    }
  }, [usuario]);

  useEffect(() => {
    if (email && idPaciente) {
      crearSuscripcion();
    }
  }, [email, idPaciente]);

  async function crearSuscripcion() {
    setLoading(true);

    try {
      // Crear suscripción primero
      const suscripcion = await suscripcionService.create({
        idPaciente,
        idMembresia: membresia.id,
      });

      console.log('✅ Suscripción creada:', suscripcion);
      setSuscripcionId(suscripcion.id);
      
    } catch (err: any) {
      console.error('Error:', err);
      toast.error(err.response?.data?.message || "Error al crear suscripción");
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Confirmar Suscripción</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-600 mb-4" />
            <p className="text-gray-600">Preparando pago...</p>
          </div>
        ) : (
          <>
            {/* Info del plan */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{membresia.nombre}</h3>
              <p className="text-sm text-gray-600 mb-4">{membresia.descripcion}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-cyan-600">S/ {membresia.precio}</span>
                <span className="text-sm text-gray-500">/ {membresia.duracionDias} días</span>
              </div>
            </div>

            {/* Email confirmación */}
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Recibo será enviado a:</p>
              <p className="font-semibold text-gray-800">{email}</p>
            </div>

            {/* Culqi Button */}
            {suscripcionId && email && (
              <CulqiSuscripcionButton
                monto={parseFloat(membresia.precio)}
                correo={email}
                suscripcionId={suscripcionId}
                autoOpen={true}
                onClose={onClose}
                onSuccess={onSuccess}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
