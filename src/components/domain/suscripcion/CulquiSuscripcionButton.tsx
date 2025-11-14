// components/domain/suscripcion/CulqiSuscripcionButton.tsx

'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { pagoSuscripcionService } from '@/services/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Props {
  monto: number;
  correo: string;
  suscripcionId: string;
  autoOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const CulqiSuscripcionButton = ({ 
  monto, 
  correo, 
  suscripcionId, 
  autoOpen = true,
  onClose,
  onSuccess
}: Props) => {
  const checkoutRef = useRef<any>(null);
  const hasOpenedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    // Stub para Culqi3DS
    if (!(window as any).Culqi3DS) {
      (window as any).Culqi3DS = class {
        setup() { return Promise.resolve(); }
        generateDeviceId() { return Promise.resolve('culqi3ds-stub'); }
      };
      console.log('✅ Culqi3DS stub creado');
    }

    // Cargar script de Culqi
    const loadCulqiScript = () => {
      if (document.getElementById('culqi-checkout-js')) return Promise.resolve();

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://js.culqi.com/checkout-js';
        script.id = 'culqi-checkout-js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Error cargando Culqi'));
        document.body.appendChild(script);
      });
    };

    loadCulqiScript()
      .then(() => {
        console.log('✅ Script de Culqi cargado');
        
        const waitForCulqi = () => {
          if (!(window as any).CulqiCheckout) {
            setTimeout(waitForCulqi, 100);
            return;
          }
          initializeCulqi();
        };

        waitForCulqi();
      })
      .catch((err) => {
        console.error('❌ Error cargando Culqi:', err);
      });

    return () => {
      checkoutRef.current = null;
    };
  }, []);

  const initializeCulqi = () => {
    try {
      const CulqiCheckout = (window as any).CulqiCheckout;

      if (!correo || correo === '') {
        console.error('❌ Email vacío:', correo);
        toast.error('Error: No se pudo obtener tu correo electrónico');
        return;
      }

      console.log('📧 Email para pago:', correo);

      const settings = {
        title: 'Membresía Premium - Centro Relax',
        currency: 'PEN',
        amount: Math.round(monto * 100),
      };

      const client = {
        email: correo,
      };

      const options = {
        lang: 'es',
        modal: true,
        installments: false,
      };

      const instance = new CulqiCheckout('pk_test_kl7nFnAB10anF85e', {
        settings,
        client,
        options,
      });

      // 🔥 Callback cuando Culqi genera el token
      instance.culqi = async function () {
        const token = (instance as any).token;

        if (token) {
          console.log('🎫 Token generado:', token.id);

          try {
            const payload = {
              idSuscripcion: suscripcionId,
              token: token.id,
              email: correo,
            };

            console.log('📤 Enviando al backend:', payload);

            const response = await pagoSuscripcionService.pagarConTarjeta(payload);

            console.log('✅ Pago exitoso:', response);

            // 1️⃣ Cerrar modal
            try {
              instance.close();
              console.log('✅ Modal cerrado');
            } catch (err) {
              console.warn('⚠️ No se pudo cerrar Culqi:', err);
            }

            // 2️⃣ Delay para asegurar cierre
            await new Promise(resolve => setTimeout(resolve, 300));

            // 3️⃣ Confetti
            confetti({
              particleCount: 200,
              spread: 100,
              origin: { y: 0.6 },
              zIndex: 99999,
            });

            // 4️⃣ Toast de éxito
            toast.success('🎉 ¡Bienvenido a tu membresía premium!');

            // 5️⃣ Callback de éxito
            if (onSuccess) {
              onSuccess();
            }

            // 6️⃣ Callback de cierre
            if (onClose) {
              onClose();
            }

            // 7️⃣ Redirigir
            setTimeout(() => {
              router.push('/paciente/suscripcion');
              router.refresh();
            }, 2000);

          } catch (err: any) {
            console.error('❌ Error al procesar pago:', err);
            
            try {
              instance.close();
            } catch (e) {
              console.warn('⚠️ No se pudo cerrar Culqi:', e);
            }

            toast.error(
              err.response?.data?.message || 
              '⚠️ Error al procesar el pago. Intenta nuevamente.'
            );

            if (onClose) onClose();
          }
        } else if ((instance as any).error) {
          console.error('❌ Error de Culqi:', (instance as any).error);
          toast.error('⚠️ Error en el pago. Verifica tus datos.');
        }
      };

      checkoutRef.current = instance;

      // 🔥 Abrir automáticamente
      if (autoOpen && !hasOpenedRef.current) {
        hasOpenedRef.current = true;
        
        setTimeout(() => {
          try {
            const maybePromise = instance.open();
            
            if (maybePromise && typeof maybePromise.then === 'function') {
              maybePromise
                .then(() => {
                  console.log('✅ Culqi abierto correctamente');
                  setTimeout(() => {
                    const culqiInput = document.querySelector('.culqi-card-number');
                    if (culqiInput) {
                      (culqiInput as HTMLElement).focus();
                    }
                  }, 100);
                })
                .catch((err: any) => {
                  console.warn('⚠️ Error en open():', err);
                });
            }
            
          } catch (err) {
            console.error('❌ Error abriendo Culqi:', err);
          }
        }, 800);
      }

    } catch (err) {
      console.error('❌ Error inicializando Culqi:', err);
    }
  };

  // Botón manual
  if (!autoOpen) {
    return (
      <button
        onClick={() => {
          try {
            if (!(window as any).Culqi3DS) {
              (window as any).Culqi3DS = class {
                setup() { return Promise.resolve(); }
                generateDeviceId() { return Promise.resolve('culqi3ds-stub'); }
              };
            }
            
            const maybePromise = checkoutRef.current?.open();
            if (maybePromise && typeof maybePromise.then === 'function') {
              maybePromise.catch((err: any) => console.warn('Error:', err));
            }
          } catch (err) {
            console.error('❌ Error abriendo Culqi:', err);
          }
        }}
        className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 w-full font-medium transition"
      >
        💳 Pagar con Tarjeta
      </button>
    );
  }

  return null;
};