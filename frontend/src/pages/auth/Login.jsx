import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { loginUser } from '../../features/auth/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  function handlerLoginSubmit(ev) {
    ev.preventDefault();
    dispatch(loginUser(form));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">

      {/* Background effect */}
      <div className="absolute inset-0 bg-linear-to-br from-white via-zinc-900 to-white opacity-95" />

      {/* Card */}
      <Card className="relative w-full max-w-4xl grid md:grid-cols-2 rounded-2xl shadow-2xl bg-white overflow-hidden">

        {/* ================= LEFT SIDE ================= */}
        <div className="p-10 flex flex-col justify-center">

          <h1 className="text-3xl font-bold text-center mb-8">
            Login
          </h1>

          <form onSubmit={handlerLoginSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter email"
                  className="pl-9"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter password"
                  className="pl-9"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Remember me</span>
              <Link to="#" className="hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <Button className="w-full" type="submit">
              Log in
            </Button>
          </form>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="p-10 bg-muted/40 flex flex-col justify-center">

          <h2 className="text-lg font-semibold mb-6 text-center">
            Continue with
          </h2>

          <div className="space-y-4">

            <Button variant="outline" className="w-full">
              Continue with Google
            </Button>

            <Button variant="outline" className="w-full">
              Continue with Apple
            </Button>

            <Button variant="outline" className="w-full">
              Continue with Facebook
            </Button>
          </div>

          <Separator className="my-6" />

          <p className="text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link to="/register" className="text-primary font-medium">
              Register
            </Link>
          </p>
        </div>

      </Card>
    </div>
  )
}

export default Login;
