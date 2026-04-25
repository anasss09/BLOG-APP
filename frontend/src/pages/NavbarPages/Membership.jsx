import React from 'react'
import { Link } from 'react-router-dom'
import { Check, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Membership = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_16%,#ffffff_44%,#f8fafc_100%)]">
      {/* Header */}
      <div className="relative overflow-hidden bg-slate-950 py-20 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.24),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_34%)]" />
        <div className="relative max-w-4xl mx-auto px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">Membership</p>
        <h1 className="mt-4 text-5xl font-extrabold text-white mb-6">Become a Member</h1>
        <p className="text-xl text-slate-200 max-w-2xl mx-auto">
          Join our global community of thinkers, researchers, and professionals. Gain exclusive access to premium content, network with experts, and attend special events.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-full bg-white text-slate-950 hover:bg-slate-200">
            <Link to="/search">
              Explore Content
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-white/20 bg-transparent text-white hover:bg-white hover:text-slate-950">
            <Link to="/about">Learn About Us</Link>
          </Button>
        </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Basic Plan */}
          <div className="border border-slate-200 rounded-[2rem] p-8 hover:-translate-y-1 hover:shadow-lg transition bg-white flex flex-col shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Basic</h3>
            <p className="text-slate-500 mb-6 flex-1">For casual readers looking to stay updated on global trends.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900">Free</span>
              <span className="text-slate-500">/forever</span>
            </div>
            <Button className="mb-8 rounded-full bg-slate-950 text-white hover:bg-slate-800">
              Sign Up
            </Button>
            <ul className="space-y-4 text-slate-600">
              <li className="flex items-center gap-3"><Check className="text-sky-600" size={20} /> Access to public research</li>
              <li className="flex items-center gap-3"><Check className="text-sky-600" size={20} /> Weekly newsletter</li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="border border-sky-200 rounded-[2rem] p-8 shadow-xl bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-sky-600 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Professional</h3>
            <p className="text-slate-500 mb-6 flex-1">For professionals requiring deeper insights and data.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900">$19</span>
              <span className="text-slate-500">/month</span>
            </div>
            <Button className="mb-8 rounded-full bg-sky-600 text-white hover:bg-sky-700 shadow-lg">
              Get Started
            </Button>
            <ul className="space-y-4 text-slate-600">
              <li className="flex items-center gap-3"><Check className="text-sky-600" size={20} /> Everything in Basic</li>
              <li className="flex items-center gap-3"><Check className="text-sky-600" size={20} /> Full access to exclusive reports</li>
              <li className="flex items-center gap-3"><Check className="text-sky-600" size={20} /> Early access to events</li>
              <li className="flex items-center gap-3"><Check className="text-sky-600" size={20} /> Community forum access</li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="border border-slate-200 rounded-[2rem] p-8 hover:-translate-y-1 hover:shadow-lg transition bg-white flex flex-col shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Enterprise</h3>
            <p className="text-slate-500 mb-6 flex-1">For organizations needing comprehensive analytics and team access.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900">$99</span>
              <span className="text-slate-500">/month</span>
            </div>
            <Button variant="outline" className="mb-8 rounded-full border-slate-300 text-slate-900 hover:bg-slate-100">
              Contact Sales
            </Button>
            <ul className="space-y-4 text-slate-600">
              <li className="flex items-center gap-3"><Check className="text-slate-900" size={20} /> Everything in Professional</li>
              <li className="flex items-center gap-3"><Check className="text-slate-900" size={20} /> Dedicated account manager</li>
              <li className="flex items-center gap-3"><Check className="text-slate-900" size={20} /> 1-on-1 expert consultations</li>
              <li className="flex items-center gap-3"><Check className="text-slate-900" size={20} /> Advanced customized data</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Membership
