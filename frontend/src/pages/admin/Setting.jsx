import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, LockKeyhole, Save, Shield } from "lucide-react";
import { toast } from "sonner";

import axios from "../../utils/axios";
import { checkAuth } from "../../features/auth/authSlice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Recently";

const Setting = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    profilePic: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || "",
        email: user.email || "",
        profilePic: user.profilePic || "",
      });
    }
  }, [user]);

  const memberSince = useMemo(() => formatDate(user?.createdAt), [user?.createdAt]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();

    try {
      setSavingProfile(true);
      await axios.patch("/users/profile/me", profileForm);
      await dispatch(checkAuth());
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setSavingPassword(true);
      await axios.patch("/users/password/me", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-slate-500">
          Manage your admin profile, contact details, and account security.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              These details appear across the admin workspace and content records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSave} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={profileForm.fullName}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    disabled={savingProfile}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    placeholder="Enter your email"
                    disabled={savingProfile}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profilePic">Profile Image URL</Label>
                <Input
                  id="profilePic"
                  name="profilePic"
                  value={profileForm.profilePic}
                  onChange={handleProfileChange}
                  placeholder="https://example.com/profile.jpg"
                  disabled={savingProfile}
                />
                <p className="text-xs text-slate-500">
                  Paste any public image URL if you want a custom profile avatar.
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={savingProfile}>
                  {savingProfile ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 text-white shadow-sm">
          <CardHeader>
            <CardTitle>Admin Snapshot</CardTitle>
            <CardDescription className="text-slate-300">
              Your current access and profile overview.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              {profileForm.profilePic ? (
                <img
                  src={profileForm.profilePic}
                  alt={profileForm.fullName}
                  className="h-16 w-16 rounded-full object-cover border border-white/10"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-xl font-semibold">
                  {(profileForm.fullName || "A")
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase())
                    .join("")}
                </div>
              )}

              <div>
                <p className="text-lg font-semibold">{profileForm.fullName || "Admin"}</p>
                <p className="text-sm text-slate-300">{profileForm.email}</p>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Role</p>
                <div className="mt-2">
                  <Badge className="bg-white/10 text-white hover:bg-white/10">
                    {user?.role || "admin"}
                  </Badge>
                </div>
              </div>

              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Member Since</p>
                <p className="mt-2 font-medium">{memberSince}</p>
              </div>

              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Access Level</p>
                <p className="mt-2 text-sm text-slate-300">
                  Full administrative access including users, content, and settings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LockKeyhole className="h-5 w-5" />
              Password & Security
            </CardTitle>
            <CardDescription>
              Update your password regularly to keep the admin workspace secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSave} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  disabled={savingPassword}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="At least 6 characters"
                    disabled={savingPassword}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Re-enter new password"
                    disabled={savingPassword}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={savingPassword}>
                  {savingPassword ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Shield className="mr-2 h-4 w-4" />
                  )}
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Security Notes</CardTitle>
            <CardDescription>
              Quick reminders for keeping the admin side protected.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <div className="rounded-xl border bg-slate-50 p-4">
              Use a unique password for admin access and change it after team changes.
            </div>
            <div className="rounded-xl border bg-slate-50 p-4">
              Avoid sharing one admin account across multiple people. Use role-based access instead.
            </div>
            <div className="rounded-xl border bg-slate-50 p-4">
              Keep profile email current so account recovery and important alerts remain reliable.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Setting;
