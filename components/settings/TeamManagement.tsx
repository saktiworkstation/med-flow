'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  UserPlus,
  Loader2,
  Copy,
  Check,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { inviteSchema, type InviteFormData } from '@/lib/validations';
import { getSupabaseClient } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { getRoleLabel, getRoleBadgeColor, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { User } from '@/types/database';

/**
 * TeamManagement — Komponen untuk mengelola anggota tim klinik.
 * Fitur: invite staff baru, edit role, toggle aktif, hapus (soft delete).
 * Hanya clinic_owner yang bisa mengakses fitur invite/edit/delete.
 */
export default function TeamManagement() {
  const { user } = useAuth();
  const supabase = getSupabaseClient();
  const isOwner = user?.role === 'clinic_owner';

  // State
  const [members, setMembers] = useState<User[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [successData, setSuccessData] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
  });

  const selectedRole = watch('role');

  // Fetch team members
  const fetchMembers = useCallback(async () => {
    if (!user?.clinic_id) return;
    setLoadingMembers(true);
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('clinic_id', user.clinic_id)
      .order('created_at', { ascending: true });
    setMembers(data || []);
    setLoadingMembers(false);
  }, [user?.clinic_id, supabase]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Invite staff
  const onInvite = async (data: InviteFormData) => {
    setInviting(true);
    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          full_name: data.full_name,
          role: data.role,
          specialization: data.specialization || undefined,
          license_number: data.license_number || undefined,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      // Tampilkan modal sukses
      setSuccessData({
        email: data.email,
        password: result.temporary_password,
      });
      reset();
      fetchMembers();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gagal mengundang staff';
      toast.error(message);
    } finally {
      setInviting(false);
    }
  };

  // Copy password to clipboard
  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Toggle active status
  const handleToggleActive = async (member: User) => {
    setActionLoading(member.id);
    try {
      const res = await fetch('/api/invite', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: member.id,
          is_active: !member.is_active,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success(`${member.full_name} ${member.is_active ? 'dinonaktifkan' : 'diaktifkan'}`);
      fetchMembers();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gagal mengubah status';
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  // Update role
  const handleUpdateRole = async () => {
    if (!editingUser || !editRole) return;
    setEditSaving(true);
    try {
      const res = await fetch('/api/invite', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: editingUser.id,
          role: editRole,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success(`Role ${editingUser.full_name} berhasil diubah`);
      setEditingUser(null);
      fetchMembers();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gagal mengubah role';
      toast.error(message);
    } finally {
      setEditSaving(false);
    }
  };

  // Delete (soft delete)
  const handleDelete = async (member: User) => {
    if (!confirm(`Yakin ingin menghapus ${member.full_name}? User akan dinonaktifkan.`)) return;

    setActionLoading(member.id);
    try {
      const res = await fetch('/api/invite', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: member.id, delete: true }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success(`${member.full_name} berhasil dihapus`);
      fetchMembers();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gagal menghapus user';
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Anggota Tim</CardTitle>
            <CardDescription>Kelola akses pengguna klinik</CardDescription>
          </div>
          {isOwner && (
            <Dialog
              open={inviteOpen || !!successData}
              onOpenChange={(open) => {
                if (!open) {
                  setInviteOpen(false);
                  setSuccessData(null);
                  setCopied(false);
                  reset();
                } else {
                  setInviteOpen(true);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Undang Staff
                </Button>
              </DialogTrigger>
              <DialogContent>
                {successData ? (
                  // Modal sukses — tampilkan kredensial
                  <>
                    <DialogHeader>
                      <DialogTitle>Staff Berhasil Diundang!</DialogTitle>
                      <DialogDescription>
                        Berikan kredensial berikut kepada staff. Mereka bisa login dan mengganti password.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="font-medium">{successData.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Password Sementara</p>
                          <div className="flex items-center gap-2">
                            <code className="rounded bg-background px-2 py-1 text-sm font-mono font-bold">
                              {successData.password}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(successData.password)}
                            >
                              {copied ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Staff bisa langsung login dengan email dan password di atas, lalu mengganti password di halaman Settings.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          setSuccessData(null);
                          setInviteOpen(false);
                        }}
                      >
                        Tutup
                      </Button>
                    </DialogFooter>
                  </>
                ) : (
                  // Form invite
                  <>
                    <DialogHeader>
                      <DialogTitle>Undang Staff Baru</DialogTitle>
                      <DialogDescription>
                        Staff akan mendapatkan akun dengan password sementara.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onInvite)} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input placeholder="staff@klinik.com" {...register('email')} />
                        {errors.email && (
                          <p className="text-xs text-destructive">{errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Nama Lengkap *</Label>
                        <Input placeholder="Nama lengkap staff" {...register('full_name')} />
                        {errors.full_name && (
                          <p className="text-xs text-destructive">{errors.full_name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Role *</Label>
                        <Select
                          onValueChange={(value) =>
                            setValue('role', value as InviteFormData['role'], { shouldValidate: true })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="doctor">Dokter</SelectItem>
                            <SelectItem value="nurse">Perawat</SelectItem>
                            <SelectItem value="receptionist">Resepsionis</SelectItem>
                            <SelectItem value="pharmacist">Apoteker</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.role && (
                          <p className="text-xs text-destructive">{errors.role.message}</p>
                        )}
                      </div>

                      {/* Spesialisasi — hanya muncul kalau role = doctor */}
                      {selectedRole === 'doctor' && (
                        <div className="space-y-2">
                          <Label>Spesialisasi</Label>
                          <Input placeholder="Umum, Anak, Gigi, dll." {...register('specialization')} />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Nomor Lisensi / SIP</Label>
                        <Input placeholder="SIP-xxx (opsional)" {...register('license_number')} />
                      </div>

                      <DialogFooter>
                        <Button type="submit" disabled={inviting}>
                          {inviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Undang
                        </Button>
                      </DialogFooter>
                    </form>
                  </>
                )}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loadingMembers ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : members.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            <p className="text-sm">Belum ada anggota tim</p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  !member.is_active ? 'opacity-50' : ''
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{member.full_name}</p>
                    {!member.is_active && (
                      <Badge variant="outline" className="text-xs">
                        Nonaktif
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Bergabung: {formatDate(member.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getRoleBadgeColor(member.role)}>
                    {getRoleLabel(member.role)}
                  </Badge>
                  {/* Aksi hanya untuk owner, dan tidak untuk diri sendiri */}
                  {isOwner && member.id !== user?.id && (
                    <div className="flex items-center gap-1">
                      {/* Edit Role */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Edit role"
                        onClick={() => {
                          setEditingUser(member);
                          setEditRole(member.role);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      {/* Toggle Active */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title={member.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        disabled={actionLoading === member.id}
                        onClick={() => handleToggleActive(member)}
                      >
                        {actionLoading === member.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : member.is_active ? (
                          <ToggleRight className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </Button>
                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        title="Hapus"
                        disabled={actionLoading === member.id}
                        onClick={() => handleDelete(member)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Dialog Edit Role */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Ubah role untuk {editingUser?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={editRole} onValueChange={setEditRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor">Dokter</SelectItem>
                <SelectItem value="nurse">Perawat</SelectItem>
                <SelectItem value="receptionist">Resepsionis</SelectItem>
                <SelectItem value="pharmacist">Apoteker</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Batal
            </Button>
            <Button onClick={handleUpdateRole} disabled={editSaving}>
              {editSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
