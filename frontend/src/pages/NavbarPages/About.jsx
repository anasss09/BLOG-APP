import React from 'react'

const About = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_16%,#ffffff_44%,#f8fafc_100%)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-950 text-white py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_32%)]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 z-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">About</p>
          <h1 className="mt-4 text-5xl md:text-6xl font-extrabold tracking-tight mb-6">About Our Organization</h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto text-slate-200">
            Dedicated to publishing in-depth research, events, and news on global affairs, security, and emerging technologies.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">Mission</p>
            <h2 className="mt-3 text-4xl font-bold text-slate-950 mb-6">Research with clarity, relevance, and public value.</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              In a rapidly evolving world, having access to accurate, unbiased, and comprehensive research is more important than ever. Our mission is to bridge the gap between complex global challenges and the broader public understanding.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              We bring together leading experts from diverse fields—ranging from AI and Geopolitics to Climate Change—to deliver insightful analysis and actionable intelligence that empowers decision-makers worldwide.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/90 p-6 rounded-[1.75rem] shadow-sm border border-slate-200 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">1M+</div>
              <h3 className="font-semibold text-slate-900">Readers</h3>
            </div>
            <div className="bg-white/90 p-6 rounded-[1.75rem] shadow-sm border border-slate-200 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-lg transition mt-8">
              <div className="w-16 h-16 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">50+</div>
              <h3 className="font-semibold text-slate-900">Experts</h3>
            </div>
            <div className="bg-white/90 p-6 rounded-[1.75rem] shadow-sm border border-slate-200 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">100+</div>
              <h3 className="font-semibold text-slate-900">Events</h3>
            </div>
            <div className="bg-white/90 p-6 rounded-[1.75rem] shadow-sm border border-slate-200 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-lg transition mt-8">
              <div className="w-16 h-16 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">10+</div>
              <h3 className="font-semibold text-slate-900">Categories</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
