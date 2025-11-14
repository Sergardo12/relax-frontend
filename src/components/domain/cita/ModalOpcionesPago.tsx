// components/domain/cita/ModalOpcionesPago.tsx

"use client";

import { useState } from "react";
import { X, CreditCard, Banknote, Smartphone, Loader2 } from "lucide-react";
import { pagoCitaService } from "@/services/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { CulqiCheckoutButton } from "../payments/CulqiCheckoutButton";
import confetti from "canvas-confetti";

interface Props {
  citaId: string;
  monto: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalOpcionesPago({ citaId, monto, onClose, onSuccess }: Props) {
  const router = useRouter();
  const { usuario } = useAuthStore();
  const [metodoPago, setMetodoPago] = useState<'tarjeta' | 'efectivo' | 'yape' | null>(null);
  const [procesando, setProcesando] = useState(false);

  // 🔥 Validación más explícita con early return
  if (!usuario || !usuario.correo) {
    toast.error("No se encontró tu correo electrónico");
    onClose();
    return null;
  }

  // 🔥 Ahora TypeScript sabe que usuario Y usuario.correo existen
  const emailUsuario = usuario.correo;

  async function pagarEnEfectivo() {
    if (!confirm("¿Confirmar pago en efectivo?")) return;

    setProcesando(true);
    setMetodoPago('efectivo');
    
    try {
      await pagoCitaService.pagarConEfectivo({
        idCita: citaId,
        email: emailUsuario, // 🔥 Usar la variable local
      });
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });

      toast.success("✅ Pago en efectivo registrado. Confirma el pago en recepción.");
      
      setTimeout(() => {
        onSuccess();
        router.push('/paciente');
        router.refresh();
      }, 1500);
      
    } catch (err: any) {
      console.error('Error:', err);
      toast.error(err.response?.data?.message || "Error al registrar pago");
    } finally {
      setProcesando(false);
      setMetodoPago(null);
    }
  }

  async function pagarConYape() {
    if (!confirm("¿Confirmar pago con Yape?")) return;

    setProcesando(true);
    setMetodoPago('yape');
    
    try {
      await pagoCitaService.pagarConYape({
        idCita: citaId,
        email: emailUsuario, // 🔥 Agregar email
      });
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });

      toast.success("✅ Pago con Yape registrado. Confirma el pago en recepción.");
      
      setTimeout(() => {
        onSuccess();
        router.push('/paciente');
        router.refresh();
      }, 1500);
      
    } catch (err: any) {
      console.error('Error:', err);
      toast.error(err.response?.data?.message || "Error al registrar pago");
    } finally {
      setProcesando(false);
      setMetodoPago(null);
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Opciones de Pago</h2>
              <p className="text-sm text-gray-600 mt-1">Total a pagar: <span className="font-bold text-cyan-600">S/ {monto.toFixed(2)}</span></p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              disabled={procesando}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Opciones */}
          <div className="p-6 space-y-3">
            
            {/* Tarjeta */}
            <button
              onClick={() => setMetodoPago('tarjeta')}
              disabled={procesando}
              className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-cyan-500 hover:bg-cyan-50 transition group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="bg-cyan-100 p-3 rounded-full group-hover:bg-cyan-200 transition">
                <CreditCard className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-800">Pagar con Tarjeta</p>
                <p className="text-sm text-gray-500">Visa, Mastercard, Amex</p>
              </div>
            </button>

            {/* Efectivo */}
            <button
              onClick={pagarEnEfectivo}
              disabled={procesando}
              className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition">
                {procesando && metodoPago === 'efectivo' ? (
                  <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                ) : (
                  <Banknote className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-800">Pagar en Efectivo</p>
                <p className="text-sm text-gray-500">Paga en recepción</p>
              </div>
            </button>

            {/* Yape */}
            <button
              onClick={pagarConYape}
              disabled={procesando}
              className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition">
                {procesando && metodoPago === 'yape' ? (
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                ) : (
                  <Smartphone className="w-6 h-6 text-purple-600" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-800">Pagar con Yape</p>
                <p className="text-sm text-gray-500">Transferencia móvil</p>
              </div>
            </button>

          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
            <p className="text-xs text-gray-500 text-center">
              Al confirmar el pago, aceptas los términos y condiciones
            </p>
          </div>

        </div>
      </div>

      {/* Culqi Checkout (solo si selecciona tarjeta) */}
      {metodoPago === 'tarjeta' && usuario?.correo && (
        <CulqiCheckoutButton
          monto={monto}
          correo={usuario.correo}
          citaId={citaId}
          autoOpen={true}
          onClose={() => {
            setMetodoPago(null);
            onClose();
          }}
          onSuccess={() => {
            setMetodoPago(null);
            onSuccess();
          }}
        />
      )}
    </>
  );
}