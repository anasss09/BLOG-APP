import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Loader2, RefreshCcw, ShieldCheck, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";

import axios from "../../utils/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const roleColors = {
  admin: "bg-red-100 text-red-700 hover:bg-red-100",
  editor: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  member: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  guest: "bg-slate-100 text-slate-700 hover:bg-slate-100",
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const roleOptions = ["admin", "editor", "member", "guest"];

const User = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [draftRoles, setDraftRoles] = useState({});
  const [savingUserId, setSavingUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/users");
      setUsers(res.data.users || []);
      setDraftRoles(
        Object.fromEntries((res.data.users || []).map((user) => [user._id, user.role]))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return users;

    return users.filter((user) =>
      [user.fullName, user.email, user.role].some((field) =>
        String(field || "").toLowerCase().includes(query)
      )
    );
  }, [searchTerm, users]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((user) => user.role === "admin").length,
      editors: users.filter((user) => user.role === "editor").length,
      members: users.filter((user) => user.role === "member").length,
    };
  }, [users]);

  const handleRoleChange = (userId, role) => {
    setDraftRoles((prev) => ({ ...prev, [userId]: role }));
  };

  const handleSaveRole = async (userId) => {
    try {
      setSavingUserId(userId);
      const res = await axios.patch(`/users/${userId}/role`, {
        role: draftRoles[userId],
      });

      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? res.data.user : user))
      );
      toast.success("User role updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    } finally {
      setSavingUserId(null);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">
            Review everyone with access and manage admin roles safely.
          </p>
        </div>

        <div className="flex gap-3">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or role"
            className="w-full md:w-72 bg-white"
          />
          <Button
            type="button"
            variant="outline"
            onClick={fetchUsers}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats.total}</p>
              <UsersIcon className="h-5 w-5 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats.admins}</p>
              <ShieldCheck className="h-5 w-5 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Editors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.editors}</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.members}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Team Access</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="px-6 pb-6 text-slate-500">No users matched your search.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead className="border-y bg-slate-50 text-left text-sm text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">User</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Joined</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const isSelf = String(user._id) === String(currentUser?._id);
                    const currentRole = draftRoles[user._id] || user.role;

                    return (
                      <tr key={user._id} className="border-b last:border-b-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                              {getInitials(user.fullName)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {user.fullName}
                                {isSelf ? " (You)" : ""}
                              </p>
                              <p className="text-sm text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Badge className={roleColors[user.role] || roleColors.guest}>
                              {user.role}
                            </Badge>
                            <select
                              value={currentRole}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              disabled={isSelf || savingUserId === user._id}
                              className="rounded-md border bg-white px-3 py-2 text-sm"
                            >
                              {roleOptions.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(user.createdAt)}
                        </td>

                        <td className="px-6 py-4">
                          <Badge variant="outline">
                            {isSelf ? "Protected" : "Active"}
                          </Badge>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleSaveRole(user._id)}
                            disabled={
                              isSelf ||
                              savingUserId === user._id ||
                              currentRole === user.role
                            }
                          >
                            {savingUserId === user._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Save Role"
                            )}
                          </Button>
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
    </div>
  );
};

export default User;
