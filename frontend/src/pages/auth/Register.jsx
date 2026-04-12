import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { Mail, Lock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import { registerUser } from "../../features/auth/authSlice"

const Register = () => {
  const dispatch = useDispatch()

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  function handlerSubmit(e) {
    e.preventDefault()
    dispatch(registerUser(form))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-white via-zinc-900 to-white opacity-95" />

      <Card className="relative w-full max-w-4xl grid md:grid-cols-2 rounded-2xl shadow-2xl bg-white overflow-hidden">

        {/* ================= LEFT SIDE ================= */}
        <div className="p-10 flex flex-col justify-center">

          <h1 className="text-3xl font-bold text-center mb-8">
            Create Account
          </h1>

          <form onSubmit={handlerSubmit} className="space-y-5">

            {/* Name */}
            <div className="space-y-2">
              <Label>Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter name"
                  className="pl-9"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                />
              </div>
            </div>

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

            {/* Submit */}
            <Button className="w-full" type="submit">
              Register
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="p-10 bg-muted/40 flex flex-col justify-center">

          <h2 className="text-lg font-semibold mb-6 text-center">
            Sign up with
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
            Fast & secure registration
          </p>
        </div>

      </Card>
    </div>
  )
}

export default Register
