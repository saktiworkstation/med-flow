import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  Pill,
  Package,
  Receipt,
  BarChart3,
  Settings,
  Bell,
  Stethoscope,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '@/types/database';

// ── Navigation Items ───────────────────

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    roles: ['super_admin', 'clinic_owner', 'doctor', 'nurse', 'receptionist', 'pharmacist'],
  },
  {
    title: 'Pasien',
    href: '/patients',
    icon: Users,
    roles: ['super_admin', 'clinic_owner', 'doctor', 'nurse', 'receptionist'],
  },
  {
    title: 'Jadwal',
    href: '/appointments',
    icon: CalendarDays,
    roles: ['super_admin', 'clinic_owner', 'doctor', 'nurse', 'receptionist'],
  },
  {
    title: 'Rekam Medis',
    href: '/medical-records/new',
    icon: Stethoscope,
    roles: ['super_admin', 'clinic_owner', 'doctor'],
  },
  {
    title: 'Resep',
    href: '/prescriptions',
    icon: FileText,
    roles: ['super_admin', 'clinic_owner', 'doctor', 'pharmacist'],
  },
  {
    title: 'Farmasi',
    href: '/pharmacy',
    icon: ClipboardList,
    roles: ['super_admin', 'clinic_owner', 'pharmacist'],
  },
  {
    title: 'Obat',
    href: '/medications',
    icon: Pill,
    roles: ['super_admin', 'clinic_owner', 'doctor', 'pharmacist'],
  },
  {
    title: 'Tagihan',
    href: '/invoices',
    icon: Receipt,
    roles: ['super_admin', 'clinic_owner', 'receptionist'],
  },
  {
    title: 'Analitik',
    href: '/analytics',
    icon: BarChart3,
    roles: ['super_admin', 'clinic_owner'],
  },
  {
    title: 'Pengaturan',
    href: '/settings',
    icon: Settings,
    roles: ['super_admin', 'clinic_owner'],
  },
];

// ── Appointment Status Flow ────────────

export const APPOINTMENT_STATUS_FLOW = {
  scheduled: ['confirmed', 'cancelled'],
  confirmed: ['in_progress', 'cancelled', 'no_show'],
  in_progress: ['completed'],
  completed: [],
  cancelled: [],
  no_show: [],
} as const;

// ── Status Labels ──────────────────────

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  scheduled: 'Terjadwal',
  confirmed: 'Dikonfirmasi',
  in_progress: 'Berlangsung',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
  no_show: 'Tidak Hadir',
};

export const APPOINTMENT_TYPE_LABELS: Record<string, string> = {
  consultation: 'Konsultasi',
  follow_up: 'Kontrol',
  emergency: 'Darurat',
  procedure: 'Tindakan',
};

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  sent: 'Terkirim',
  paid: 'Lunas',
  partially_paid: 'Sebagian',
  overdue: 'Jatuh Tempo',
  cancelled: 'Dibatalkan',
};

export const PRESCRIPTION_STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu',
  dispensed: 'Sudah Diberikan',
  partially_dispensed: 'Sebagian',
  cancelled: 'Dibatalkan',
};

export const MEDICATION_CATEGORY_LABELS: Record<string, string> = {
  tablet: 'Tablet',
  capsule: 'Kapsul',
  syrup: 'Sirup',
  injection: 'Injeksi',
  cream: 'Krim',
  drops: 'Tetes',
  inhaler: 'Inhaler',
  other: 'Lainnya',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'Tunai',
  transfer: 'Transfer Bank',
  card: 'Kartu',
  insurance: 'Asuransi',
  qris: 'QRIS',
};

// ── Tax Rate ───────────────────────────

export const DEFAULT_TAX_RATE = 0.11; // PPN 11%

// ── Time Slots ─────────────────────────

export function generateTimeSlots(
  startHour: number = 8,
  endHour: number = 21,
  intervalMinutes: number = 30
): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += intervalMinutes) {
      slots.push(
        `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
      );
    }
  }
  return slots;
}
