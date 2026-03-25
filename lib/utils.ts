import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO, differenceInYears } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

// ── Class Merge ────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Date Formatting ────────────────────

export function formatDate(date: string | Date, pattern: string = 'dd MMM yyyy') {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern, { locale: idLocale });
}

export function formatDateTime(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMM yyyy, HH:mm', { locale: idLocale });
}

export function formatTime(time: string) {
  return time.slice(0, 5); // "08:30:00" → "08:30"
}

export function formatRelative(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: idLocale });
}

export function calculateAge(dateOfBirth: string): number {
  return differenceInYears(new Date(), parseISO(dateOfBirth));
}

// ── Currency Formatting ────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

// ── String Helpers ─────────────────────

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ── Status Helpers ─────────────────────

export function getAppointmentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    confirmed: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    in_progress: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    no_show: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  };
  return colors[status] ?? colors['scheduled']!;
}

export function getInvoiceStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    partially_paid: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  };
  return colors[status] ?? colors['draft']!;
}

export function getPrescriptionStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    dispensed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    partially_dispensed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return colors[status] ?? colors['pending']!;
}

export function getStockColor(quantity: number, minAlert: number): string {
  if (quantity <= 0) return 'text-red-600 dark:text-red-400';
  if (quantity <= minAlert) return 'text-amber-600 dark:text-amber-400';
  return 'text-green-600 dark:text-green-400';
}

// ── Role Helpers ───────────────────────

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    super_admin: 'Super Admin',
    clinic_owner: 'Pemilik Klinik',
    doctor: 'Dokter',
    nurse: 'Perawat',
    receptionist: 'Resepsionis',
    pharmacist: 'Apoteker',
  };
  return labels[role] ?? role;
}

export function getRoleBadgeColor(role: string): string {
  const colors: Record<string, string> = {
    super_admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    clinic_owner: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
    doctor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    nurse: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
    receptionist: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    pharmacist: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  };
  return colors[role] ?? '';
}

// ── Gender Helpers ─────────────────────

export function getGenderLabel(gender: string): string {
  return gender === 'male' ? 'Laki-laki' : 'Perempuan';
}

// ── Blood Type ─────────────────────────

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

// ── Debounce ───────────────────────────

export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
