// CulqiCheckoutButton.tsx
'use client';
import { useEffect, useRef } from 'react';
import { pagoCitaService } from '@/services/api'; // <-- usar tu service
import { useAuthStore } from '@/lib/store'; // opcional: fallback si quieres leer el email desde el store

interface Props {
  monto: number;         // en soles (ej: 80) — no se envía al backend si tu backend lo calcula
  correo?: string;       // recibido desde FormCita, opcional porque podemos usar authStore
  citaId: string;
  autoOpen?: boolean;    // si true abre al montarse
}


export const CulqiCheckoutButton = ({ monto, correo, citaId, autoOpen = true }: Props) => {
  const checkoutRef = useRef<any>(null);
  const authStore = useAuthStore.getState();

  useEffect(() => {
    const existing = document.getElementById('culqi-script');
    if (!existing) {
      const s = document.createElement('script');
      s.src = 'https://js.culqi.com/checkout-js';
      s.id = 'culqi-script';
      s.async = true;
      s.onload = () => {
        console.log('✅ Script Culqi cargado correctamente');
        initCheckout();
      };
      s.onerror = () => console.error('❌ Error cargando script Culqi');
      document.body.appendChild(s);
    } else {
      initCheckout();
    }

    return () => {
      checkoutRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initCheckout = () => {
    const CulqiCheckout = (window as any).CulqiCheckout;
    if (!CulqiCheckout) {
      // esperar un poco si todavía no está disponible
      setTimeout(initCheckout, 150);
      return;
    }

    const settings = {
      title: 'Centro Relax',
      currency: 'PEN',
      amount: Math.round(monto * 100),
    };

    const client = { email: correo || authStore.usuario?.correo || authStore.usuario?.correo || '' };
    const options = { lang: 'es', modal: true, installments: false };

    try {
      const instance = new CulqiCheckout('pk_test_kl7nFnAB10anF85e', { settings, client, options });

      instance.culqi = async function () {
        // Culqi pone token en instance.token
        if ((instance as any).token) {
          const token = (instance as any).token.id;
          console.log('✅ Token generado por Culqi:', token);

          try {
            // Usar tu pagoCitaService (envía idCita, token, email) — tu backend maneja monto
            const payload = {
              idCita: citaId,
              token,
              email: client.email,
            };
            const response = await pagoCitaService.pagarConTarjeta(payload);
            console.log('💰 Respuesta backend pagoCitaService:', response);

            // emitir evento global si quieres que FormCita lo atienda
            window.dispatchEvent(new CustomEvent('culqi:payment-success', { detail: { idCita: citaId, response } }));
          } catch (err) {
            console.error('❌ Error al enviar token al backend via pagoCitaService:', err);
            window.dispatchEvent(new CustomEvent('culqi:payment-failed', { detail: { idCita: citaId, error: err } }));
          }
        } else if ((instance as any).error) {
          console.error('❌ Culqi error:', (instance as any).error);
        }
      };

      checkoutRef.current = instance;

      if (autoOpen) {
        // try/catch porque el script a veces lanza Culqi3DS undefined — atrapamos y seguimos
        setTimeout(() => {
          try {
            checkoutRef.current.open();
            console.log('🟢 Checkout abierto (autoOpen)');
          } catch (err) {
            console.error('❌ Error abriendo CulqiCheckout:', err);
          }
        }, 200);
      }
    } catch (err) {
      console.error('❌ Error inicializando CulqiCheckout:', err);
    }
  };

  const handleOpen = () => {
    if (!checkoutRef.current) {
      console.error('❌ CulqiCheckout aún no inicializado');
      return;
    }
    try {
      checkoutRef.current.open();
    } catch (err: any) {
      if (String(err).includes('Culqi3DS')) {
        console.warn('⚠️ Culqi3DS no definido al intentar open — ignorando en modo test.', err);
      } else {
        console.error('❌ Error al abrir CulqiCheckout:', err);
      }
    }
  };

  // Si autoOpen true, no renderizamos botón (flujo: crear -> abrir)
  if (!autoOpen) {
    return (
      <button onClick={handleOpen} className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 w-full">
        💳 Pagar con Tarjeta
      </button>
    );
  }
  return null;
};
