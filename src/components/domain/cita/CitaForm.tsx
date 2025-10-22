"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { citaService, detalleCitaService } from "@/services/api";
import { useEspecialidades } from "@/hooks/useEspecialidades";
import { useColaboradoresPorEspecialidad } from "@/hooks/useColaboradoresPorEspecialidad";
import { useServiciosPorEspecialidad } from "@/hooks/useServiciosPorEspecialidad";
import { CrearCitaDto } from "@/types";

import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";
import { CulqiCheckoutButton } from "../payments/CulqiCheckoutButton";

export default function FormCita() {
  const { register, handleSubmit, reset } = useForm<CrearCitaDto>({
    defaultValues: {
      fecha: "",
      hora: "",
    },
  });

  // Estados locales
  const [idEspecialidad, setIdEspecialidad] = useState<string>("");
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<
    string[]
  >([]);
  const [idColaborador, setIdColaborador] = useState<string>("");

  // Hooks personalizados
  const { especialidades, loading: loadingEsp } = useEspecialidades();
  const { colaboradores, loading: loadingCol } =
    useColaboradoresPorEspecialidad(idEspecialidad);
  const { servicios, loading: loadingServ } =
    useServiciosPorEspecialidad(idEspecialidad);
  const [citaCreada, setCitaCreada] = useState<any>(null);
  const [pagoExitoso, setPagoExitoso] = useState(false);

  // Envío del formulario
  const onSubmit = async (data: CrearCitaDto) => {
    try {
      const { obtenerDatosCompletos } = useAuthStore.getState();
      const datosPaciente = await obtenerDatosCompletos();
      if (!datosPaciente?.id) {
        toast.error("No se encontró información del paciente");
        return;
      }

      // 1️⃣ Crear cita principal
      const cita = await citaService.create({
        idPaciente: datosPaciente?.id,
        fecha: data.fecha,
        hora: data.hora,
      });

      // 2️⃣ Crear los detalles
      for (const idServicio of serviciosSeleccionados) {
        await detalleCitaService.create({
          idCita: cita.id,
          idServicio,
          idColaborador,
        });
      }

      const montoTotal = servicios
        .filter((s) => serviciosSeleccionados.includes(s.id))
        .reduce((acc, s) => acc + Number(s.precio), 0);

      toast.success("Cita registrada correctamente ✅");

      // 3️⃣ Abrir el checkout Culqi automáticamente
      setTimeout(() => {
        const btn = document.createElement("button");
        btn.style.display = "none";
        document.body.appendChild(btn);

        // Importamos dinámicamente el módulo del botón
        import("../payments/CulqiCheckoutButton").then(
          ({ CulqiCheckoutButton }) => {
            const tempDiv = document.createElement("div");
            document.body.appendChild(tempDiv);

            // Creamos el componente en memoria y lo montamos manualmente
            const Comp = () => (
              <CulqiCheckoutButton
                monto={montoTotal}
                correo={datosPaciente.correo}
                citaId={cita.id}
              />
            );

            import("react-dom/client").then(({ createRoot }) => {
              const root = createRoot(tempDiv);
              root.render(<Comp />);
              btn.click(); // dispara apertura del checkout
            });
          }
        );
      }, 300);
    } catch (error: any) {
      console.error("❌ Error completo:", error);
      toast.error("Error al registrar la cita");
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 text-gray-700 bg-white shadow-md rounded-xl p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Registrar nueva cita
      </h2>

      {/* Especialidad */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Especialidad
        </label>
        <select
          className="border border-gray-300 rounded-lg p-2 w-full focus:ring-cyan-500 focus:border-cyan-500"
          value={idEspecialidad}
          onChange={(e) => setIdEspecialidad(e.target.value)}
        >
          <option value="">Seleccione una especialidad</option>
          {especialidades.map((esp) => (
            <option key={esp.id} value={esp.id}>
              {esp.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Servicios */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Servicios
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {servicios.map((serv) => (
            <div
              key={serv.id}
              onClick={() =>
                setServiciosSeleccionados((prev) =>
                  prev.includes(serv.id)
                    ? prev.filter((s) => s !== serv.id)
                    : [...prev, serv.id]
                )
              }
              className={`cursor-pointer border rounded-xl p-4 transition-all ${
                serviciosSeleccionados.includes(serv.id)
                  ? "border-cyan-500 bg-cyan-50 shadow-sm"
                  : "border-gray-200 hover:border-cyan-300"
              }`}
            >
              <p className="font-semibold text-gray-700">{serv.nombre}</p>
              <p className="text-sm text-gray-500">{serv.descripcion}</p>
              <p className="mt-1 text-sm font-medium text-cyan-600">
                S/. {serv.precio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Fecha y hora */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Fecha
          </label>
          <input
            type="date"
            {...register("fecha", { required: true })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Hora
          </label>
          <input
            type="time"
            {...register("hora", { required: true })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Colaborador */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Especialista
        </label>
        <select
          className="border border-gray-300 rounded-lg p-2 w-full focus:ring-cyan-500 focus:border-cyan-500"
          value={idColaborador}
          onChange={(e) => setIdColaborador(e.target.value)}
          disabled={!idEspecialidad}
        >
          <option value="">Seleccione un colaborador</option>
          {colaboradores.map((col) => (
            <option key={col.id} value={col.id}>
              {col.nombres} {col.apellidos}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-cyan-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-cyan-700 transition-all"
      >
        Registrar Cita
      </button>
      {citaCreada && (
        <CulqiCheckoutButton
          monto={citaCreada.monto}
          correo={citaCreada.email}
          citaId={citaCreada.id}
          autoOpen={true} // abrirá inmediatamente y no mostrará botón
        />
      )}
    </form>
  );
}
