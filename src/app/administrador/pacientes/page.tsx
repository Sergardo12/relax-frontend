// app/administrador/pacientes/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { pacienteService } from "@/services/api";
import { PacienteResponse } from "@/types";
import { Users, Search, Eye, Loader2, User, Calendar, Activity, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/layouts/Layout";
import { formatDate } from "@/lib/utils/date";
import Modal from "@/components/domain/shared/Modal";

export default function PacientesAdminPage() {
  const { isAuthenticated, loading: authLoading } = useAuthGuard({ allowedRoles: ['administrador'] });
  
  const [pacientes, setPacientes] = useState<PacienteResponse[]>([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState<PacienteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  
  // Modal
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<PacienteResponse | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      cargarPacientes();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filtrarPacientes();
  }, [pacientes, busqueda]);

  async function cargarPacientes() {
    try {
      const data = await pacienteService.listarPacientes(); // 🔥 Verifica el nombre del método
      const ordenados = data.sort((a, b) => 
        a.apellidos.localeCompare(b.apellidos)
      );
      setPacientes(ordenados);
    } catch (err) {
      console.error('Error:', err);
      toast.error("Error al cargar pacientes");
    } finally {
      setLoading(false);
    }
  }

  function filtrarPacientes() {
    let resultado = [...pacientes];

    if (busqueda) {
      resultado = resultado.filter(p => 
        p.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
        (p.dni?.includes(busqueda) ?? false) ||
        (p.telefono?.includes(busqueda) ?? false)
      );
    }

    setPacientesFiltrados(resultado);
  }

  function calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  if (authLoading || !isAuthenticated) return null;

  return (
    <div>
        <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Pacientes</h1>
          <p className="text-gray-600 mt-1">
            Administra la información de los pacientes
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Pacientes</p>
            <p className="text-2xl font-bold text-gray-800">{pacientes.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Perfiles Completos</p>
            <p className="text-2xl font-bold text-green-600">
              {pacientes.filter(p => p.usuario.perfilCompleto).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Cuentas Activas</p>
            <p className="text-2xl font-bold text-blue-600">
              {pacientes.filter(p => p.usuario.estado === 'ACTIVO').length}
            </p>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, DNI o teléfono..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Lista de pacientes */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
          </div>
        ) : pacientesFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron pacientes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pacientesFiltrados.map((paciente) => (
              <div
                key={paciente.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {paciente.nombres.charAt(0)}{paciente.apellidos.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {paciente.nombres} {paciente.apellidos}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {calcularEdad(paciente.fechaNacimiento)} años
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    paciente.usuario.estado === 'ACTIVO'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {paciente.usuario.estado}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>DNI: {paciente.dni}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{paciente.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{paciente.usuario.correo}</span>
                  </div>
                </div>

                <button
                  onClick={() => setPacienteSeleccionado(paciente)}
                  className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition flex items-center justify-center gap-2 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Ver Perfil
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {pacienteSeleccionado && (
        <Modal
          isOpen={!!pacienteSeleccionado}
          onClose={() => setPacienteSeleccionado(null)}
          title="Perfil del Paciente"
          subtitle={`${pacienteSeleccionado.nombres} ${pacienteSeleccionado.apellidos}`}
          icon={<User className="w-6 h-6" />}
          size="xl"
        >
          <div className="space-y-6">
            {/* Info personal */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-3">Información Personal</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">DNI</p>
                  <p className="font-semibold text-gray-800">{pacienteSeleccionado.dni}</p>
                </div>
                <div>
                  <p className="text-gray-600">Fecha de Nacimiento</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(pacienteSeleccionado.fechaNacimiento)} 
                    <span className="text-gray-500 ml-2">
                      ({calcularEdad(pacienteSeleccionado.fechaNacimiento)} años)
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Teléfono</p>
                  <p className="font-semibold text-gray-800">{pacienteSeleccionado.telefono}</p>
                </div>
                <div>
                  <p className="text-gray-600">Correo</p>
                  <p className="font-semibold text-gray-800">{pacienteSeleccionado.usuario.correo}</p>
                </div>
              </div>
            </div>

            {/* Estado de cuenta */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Estado de Cuenta</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  pacienteSeleccionado.usuario.estado === 'ACTIVO'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {pacienteSeleccionado.usuario.estado}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Perfil Completo</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  pacienteSeleccionado.usuario.perfilCompleto
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {pacienteSeleccionado.usuario.perfilCompleto ? 'Sí' : 'Incompleto'}
                </span>
              </div>
            </div>

            {/* TODO: Aquí podríamos agregar historial de citas y tratamientos */}
            
            <button
              onClick={() => setPacienteSeleccionado(null)}
              className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}