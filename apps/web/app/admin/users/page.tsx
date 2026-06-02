'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@moon/ui';
import Link from 'next/link';
import { ArrowLeft, User, Search, Shield, Filter, UserMinus, UserCheck, Calendar, Activity, Info, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserItem {
  id: string;
  clerkId: string;
  phone: string | null;
  email: string | null;
  name: string | null;
  avatar: string | null;
  role: string;
  preferredLang: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to load users list.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleSuspend = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to toggle user suspension');
      const data = await res.json();
      toast({
        title: 'Success',
        description: `User role updated successfully to ${data.user?.role || 'USER'}.`,
      });
      // If the selected user modal is open, update its state too
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(data.user);
      }
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast({
        title: 'Action Failed',
        description: 'Could not suspend user.',
        variant: 'destructive',
      });
    }
  };

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-16">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-brand-500/5 blur-[100px] -z-10" />

      <Container className="py-8 max-w-6xl space-y-6 pt-24">
        {/* Navigation & Title Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="p-3 border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider">
                  Operational Control
                </Badge>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider">
                  Live Console
                </Badge>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">User Management</h1>
            </div>
          </div>

          <div className="text-sm text-slate-400 font-medium">
            Total Seeded: <span className="text-white font-mono font-bold">{users.length}</span>
          </div>
        </div>

        {/* Search and Filters controls card */}
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search riders by name, email, or system ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/25 outline-none transition"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-950/40 rounded-2xl p-1.5 border border-white/5 self-stretch md:self-auto justify-center">
              {['ALL', 'USER', 'OPERATOR', 'ADMIN'].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
                    roleFilter === role
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/15'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {role === 'ALL' ? 'All Roles' : role}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Users Table Card */}
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-white/[0.01]">
            <CardTitle className="text-white text-xl">Registered Accounts</CardTitle>
            <CardDescription className="text-slate-400">
              Configure transit authorization levels and active/suspend states for passenger credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-16 text-center text-slate-400 font-medium animate-pulse flex flex-col items-center justify-center gap-3">
                <Activity className="h-6 w-6 text-brand-400 animate-spin" />
                <span>Loading secure system profiles...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-16 text-center text-slate-400 font-medium">
                No matching system users found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-950/50 border-b border-white/10 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                      <th className="p-5 pl-8">Passenger Profile</th>
                      <th className="p-5">Contact Node</th>
                      <th className="p-5">Preferences</th>
                      <th className="p-5">Role Authority</th>
                      <th className="p-5 pr-8 text-right">Console Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((u) => {
                      const isSuspended = u.role === 'SUSPENDED';
                      return (
                        <tr key={u.id} className="hover:bg-white/[0.02] transition">
                          <td className="p-5 pl-8">
                            <div className="flex items-center gap-3.5">
                              <div className="h-11 w-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-brand-400 font-bold overflow-hidden shadow-inner">
                                {u.avatar ? (
                                  <Image src={u.avatar} alt={u.name || 'User'} width={44} height={44} className="h-full w-full object-cover" />
                                ) : (
                                  <User className="h-5.5 w-5.5 text-brand-400" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-white text-base">
                                  {u.name || 'Anonymous Commuter'}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5 tracking-tight">
                                  UUID: {u.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="text-slate-200 font-medium">{u.email || 'No Email Registered'}</div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5">{u.phone || 'No Mobile Node'}</div>
                          </td>
                          <td className="p-5">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/5 text-xs text-slate-300 font-bold uppercase tracking-wider">
                              Language: {u.preferredLang}
                            </div>
                          </td>
                          <td className="p-5">
                            <Badge 
                              className={
                                u.role === 'ADMIN'
                                  ? 'bg-red-500/10 text-red-400 border-red-500/20 font-bold px-3 py-1 rounded-xl'
                                  : u.role === 'OPERATOR'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold px-3 py-1 rounded-xl'
                                  : isSuspended
                                  ? 'bg-slate-500/10 text-slate-400 border-slate-500/20 font-bold px-3 py-1 rounded-xl line-through'
                                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold px-3 py-1 rounded-xl'
                              }
                            >
                              {u.role}
                            </Badge>
                          </td>
                          <td className="p-5 pr-8 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl px-2.5 py-1.5"
                                onClick={() => setSelectedUser(u)}
                              >
                                <Info className="h-4 w-4 mr-1.5" />
                                Inspect
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={`rounded-xl px-3 py-1.5 font-bold transition-colors ${
                                  isSuspended 
                                    ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10' 
                                    : 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                                }`}
                                onClick={() => handleToggleSuspend(u.id)}
                              >
                                {isSuspended ? (
                                  <>
                                    <UserCheck className="h-4 w-4 mr-1.5" />
                                    Activate
                                  </>
                                ) : (
                                  <>
                                    <UserMinus className="h-4 w-4 mr-1.5" />
                                    Suspend
                                  </>
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* User Details Drawer Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity">
          <Card className="w-full max-w-lg border-white/10 bg-slate-900/90 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="relative border-b border-white/5 pb-5">
              <button 
                onClick={() => setSelectedUser(null)} 
                className="absolute right-6 top-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-4 mt-2">
                <div className="h-16 w-16 rounded-3xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-extrabold text-2xl overflow-hidden">
                  {selectedUser.avatar ? (
                    <Image src={selectedUser.avatar} alt="User Avatar" width={64} height={64} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-brand-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">{selectedUser.name || 'Anonymous Commuter'}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {selectedUser.id}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6 text-sm">
              {/* Profile details grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Node</span>
                  <span className="text-white font-medium break-all block mt-1">{selectedUser.email || 'None'}</span>
                </div>
                <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mobile Node</span>
                  <span className="text-white font-medium block mt-1">{selectedUser.phone || 'None'}</span>
                </div>
                <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Role Setting</span>
                  <div className="mt-1">
                    <Badge className="bg-brand-500/10 text-brand-400 border-none font-bold px-2 py-0.5 rounded-lg text-xs">
                      {selectedUser.role}
                    </Badge>
                  </div>
                </div>
                <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Language ISO</span>
                  <span className="text-white font-bold uppercase block mt-1">{selectedUser.preferredLang}</span>
                </div>
              </div>

              {/* Simulated activity log logs */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-brand-400" />
                  Simulated Session Audits
                </h4>
                <div className="space-y-2.5 bg-slate-950/60 border border-white/5 p-4 rounded-2xl max-h-40 overflow-y-auto">
                  <div className="flex items-start justify-between text-xs pb-2 border-b border-white/5">
                    <div>
                      <p className="text-slate-200 font-semibold">Route searched: Rajiv Chowk → IGI Airport</p>
                      <p className="text-[10px] text-slate-500">Device: Android Client (v4.2.1)</p>
                    </div>
                    <span className="text-[10px] text-slate-500">2 mins ago</span>
                  </div>
                  <div className="flex items-start justify-between text-xs pb-2 border-b border-white/5">
                    <div>
                      <p className="text-slate-200 font-semibold">User suspension check toggled</p>
                      <p className="text-[10px] text-slate-500">Triggered by: Admin Control console</p>
                    </div>
                    <span className="text-[10px] text-slate-500">Just now</span>
                  </div>
                  <div className="flex items-start justify-between text-xs">
                    <div>
                      <p className="text-slate-200 font-semibold">Seeded session token created</p>
                      <p className="text-[10px] text-slate-500">Auth Method: Clerk OAuth SSO</p>
                    </div>
                    <span className="text-[10px] text-slate-500">2 hours ago</span>
                  </div>
                </div>
              </div>

              {/* Actions footer */}
              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  onClick={() => setSelectedUser(null)} 
                  className="bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold border border-white/10"
                >
                  Close Profile
                </Button>
                <Button 
                  onClick={() => handleToggleSuspend(selectedUser.id)}
                  className={`rounded-xl font-semibold shadow-md ${
                    selectedUser.role === 'SUSPENDED' 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/10'
                      : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/10'
                  }`}
                >
                  {selectedUser.role === 'SUSPENDED' ? 'Activate Account' : 'Suspend Account'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
