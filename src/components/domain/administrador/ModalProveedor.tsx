

"use client";

import { useState } from "react";
import { X, Truck, Loader2 } from "lucide-react";
import { proveedorService } from "@/services/api";
import { ProveedorResponse, CrearProveedorDto, EstadoProveedor, ActualizarProveedorDto } from "@/types";
import { toast } from "sonner";

interface Props {
  proveedor?: ProveedorResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalProveedor({ proveedor, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState(proveedor?.nombre || '');
  const [ruc, setRuc] = useState(proveedor?.ruc || '');
  const [telefono, setTelefono] = useState(proveedor?.telefono || '');
  const [email, setEmail] = useState(proveedor?.email || '');
  const [direccion, setDireccion] = useState(proveedor?.direccion || '');
  const [estado, setEstado] = useState<EstadoProveedor>(proveedor?.estado || EstadoProveedor.ACTIVO);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validar RUC (debe ser exactamente 11 dígitos)
    if (ruc.length !== 11) {
      toast.error('El RUC debe tener exactamente 11 dígitos');
      return;
    }

    // Validar email si se proporciona
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Email inválido');
      return;
    }

    setLoading(true);

    try {
      if (proveedor) {
    // 🔥 Al actualizar, enviar solo los campos del DTO de actualización
    const updateDto: ActualizarProveedorDto = {
      nombre,
      telefono,
      email: email || undefined,
      direccion: direccion || undefined,
      estado,
    };
    await proveedorService.update(proveedor.id, updateDto);
    toast.success('Proveedor actualizado');
  } else {
    // 🔥 Al crear, enviar el DTO de creación (con RUC)
    const createDto: CrearProveedorDto = {
      nombre,
      ruc,
      telefono,
      email: email || undefined,
      direccion: direccion || undefined,
    };
    await proveedorService.create(createDto);
    toast.success('Proveedor creado');
  }
      onSuccess();
    } catch (err: any) {
      console.error('Error:', err);
      toast.error(err.response?.data?.message || 'Error al guardar proveedor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6" />
              <h2 className="text-2xl font-bold">
                {proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </h2>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del proveedor *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ej: Distribuidora Belleza SAC"
            />
          </div>

          {/* RUC y Teléfono */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RUC *
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={ruc}
                onChange={(e) => {
                  const value = e.target.value;
                  // Solo números, máximo 11 dígitos
                  if (value === '' || /^\d{0,11}$/.test(value)) {
                    setRuc(value);
                  }
                }}
                required
                maxLength={11}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="20123456789"
              />
              <p className="text-xs text-gray-500 mt-1">
                {ruc.length}/11 dígitos
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono *
              </label>
              <input
                type="text"
                inputMode="tel"
                value={telefono}
                onChange={(e) => {
                  const value = e.target.value;
                  // Solo números, máximo 15 dígitos
                  if (value === '' || /^\d{0,15}$/.test(value)) {
                    setTelefono(value);
                  }
                }}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="987654321"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (opcional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="ventas@proveedor.com"
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección (opcional)
            </label>
            <textarea
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Av. Ejemplo 123, Lima"
            />
          </div>

        Estado (solo al editar)
        {proveedor && (
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
            </label>
            <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="radio"
                    value="activo"
                    checked={estado === EstadoProveedor.ACTIVO}
                    onChange={(e) => setEstado(e.target.value as EstadoProveedor)}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Activo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="radio"
                    value="inactivo"
                    checked={estado === EstadoProveedor.INACTIVO}
                    onChange={(e) => setEstado(e.target.value as EstadoProveedor)}
                    className="w-4 h-4 text-gray-600 focus:ring-gray-500"
                />
                <span className="text-sm text-gray-700">Inactivo</span>
                </label>
            </div>
            </div>
        )}
          {/* Botones */}
        <div className="flex gap-3 pt-4">
            <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
            Cancelar
            </button>
            <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {proveedor ? 'Actualizar' : 'Crear'} Proveedor
            </button>
        </div>
        </form>
    </div>
    </div>
);
}