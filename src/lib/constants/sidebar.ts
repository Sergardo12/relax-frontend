import { 
  LayoutDashboard, 
  Calendar, 
  Stethoscope, 
  Users, 
  UserCheck, 
  CreditCard, 
  Package, 
  ShoppingCart,
  ShoppingBag,
  Truck, 
  ClipboardList,
  Receipt,
  Heart
} from 'lucide-react';

export const SIDEBAR_ITEMS = {
  paciente: [
    {
      label: 'Inicio',
      href: '/paciente',
      icon: LayoutDashboard,
    },
    {
      label: 'Mis Citas',
      href: '/paciente/citas',
      icon: Calendar,
    },
    {
      label: 'Mis Tratamientos',
      href: '/paciente/tratamientos',
      icon: Stethoscope,
    },
    {
      label: 'Mi Suscripción',
      href: '/paciente/suscripcion',
      icon: CreditCard,
    },
  ],
  
  administrador: [
    {
      label: 'Dashboard',
      href: '/administrador',
      icon: LayoutDashboard,
    },
    {
      label: 'Tratamientos',
      href: '/administrador/tratamientos',
      icon: Stethoscope,
    },
    {
      label: 'Citas',
      href: '/administrador/citas',
      icon: Calendar,
    },
    {
      label: 'Pacientes',
      href: '/administrador/pacientes',
      icon: Users,
    },
    {
      label: 'Colaboradores',
      href: '/administrador/colaboradores',
      icon: UserCheck,
    },
    {
      label: 'Suscripciones',
      href: '/administrador/suscripciones',
      icon: Heart,
    },
    {
      label: 'Productos',
      href: '/administrador/productos',
      icon: Package,
    },
    {
      label: "Proveedores de Productos",
      href: '/administrador/proveedores',
      icon: Truck
    },
    {
      label: "Ventas",
      href: '/administrador/ventas',
      icon: ShoppingCart
    },
    {
      label: 'Compras',
      href: '/administrador/compras',
      icon: ShoppingBag,
    },
    {
      label: 'Gastos',
      href: '/administrador/gastos',
      icon: Receipt,
    },
  ],
  
  colaborador: [
    {
      label: 'Inicio',
      href: '/colaborador',
      icon: LayoutDashboard,
    },
    {
      label: 'Mi Agenda',
      href: '/colaborador/agenda',
      icon: Calendar,
    },
    {
      label: 'Mis Pacientes',
      href: '/colaborador/pacientes',
      icon: Users,
    },
    {
      label: 'Tratamientos',
      href: '/colaborador/tratamientos',
      icon: ClipboardList,
    },
  ],
  
  recepcionista: [
    {
      label: 'Inicio',
      href: '/recepcionista',
      icon: LayoutDashboard,
    },
    {
      label: 'Citas',
      href: '/recepcionista/citas',
      icon: Calendar,
    },
    {
      label: 'Pacientes',
      href: '/recepcionista/pacientes',
      icon: Users,
    },
  ],
};