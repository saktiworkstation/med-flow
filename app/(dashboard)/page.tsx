'use client';

import { motion } from 'framer-motion';
import {
  Users,
  CalendarDays,
  DollarSign,
  FileText,
  TrendingUp,
  Clock,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTodayAppointments } from '@/hooks/useAppointments';
import { useLowStockMedications } from '@/hooks/useMedications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/common/StatusBadge';
import { getAppointmentStatusColor, formatTime, formatCurrency } from '@/lib/utils';
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_TYPE_LABELS } from '@/lib/constants';
import { OwnerDashboard } from '@/components/dashboard/OwnerDashboard';
import { DoctorDashboard } from '@/components/dashboard/DoctorDashboard';
import { ReceptionistDashboard } from '@/components/dashboard/ReceptionistDashboard';
import { PharmacistDashboard } from '@/components/dashboard/PharmacistDashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'super_admin':
    case 'clinic_owner':
      return <OwnerDashboard user={user} />;
    case 'doctor':
      return <DoctorDashboard user={user} />;
    case 'receptionist':
      return <ReceptionistDashboard user={user} />;
    case 'pharmacist':
      return <PharmacistDashboard user={user} />;
    case 'nurse':
      return <DoctorDashboard user={user} />;
    default:
      return <OwnerDashboard user={user} />;
  }
}
