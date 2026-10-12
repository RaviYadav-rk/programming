import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { AnimatedBackground } from "./AnimatedBackground";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="relative h-screen w-full flex flex-col justify-between overflow-y-auto lg:overflow-hidden">
      <AnimatedBackground />

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-3 flex items-center justify-between shrink-0">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/25 transition-transform duration-200 group-hover:scale-105">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              Nexus
              <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                Enterprise
              </span>
            </span>
          </div>
        </Link>

        {/* System Status Pill & Docs Link */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/60 border border-white/5 text-slate-300 text-[11px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-300">All systems operational</span>
          </div>

          <a
            href="https://jwt.io/introduction"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 text-slate-400 hover:text-white transition-colors py-1 px-2.5 rounded-lg hover:bg-white/5 text-[11px]"
          >
            <span>Security Specs</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center min-h-0">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Column: Enterprise Value Proposition & Live Telemetry (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-5 pr-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-semibold">
                <Zap className="h-3 w-3 text-indigo-400" />
                <span>Zero-Trust Identity Infrastructure</span>
              </div>
              <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Enterprise authentication engineered for <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">peak security</span>.
              </h1>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                Industry-standard cryptographic JWT issuing, granular session policies, and sub-millisecond validation trusted by high-growth engineering teams.
              </p>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
                <div className="text-lg font-bold text-white tracking-tight">99.99%</div>
                <div className="text-[10px] text-slate-400 mt-0.5">SLA Availability</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
                <div className="text-lg font-bold text-indigo-400 tracking-tight">&lt; 12ms</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Token Verification</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
                <div className="text-lg font-bold text-emerald-400 tracking-tight">AES-256</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Hardware Encryption</div>
              </div>
            </div>

            {/* Compact Testimonial */}
            <div className="p-3.5 rounded-xl enterprise-card bg-slate-900/40 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-[10px] text-white">
                  ER
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-white">Elena Rostova</div>
                  <div className="text-[10px] text-slate-400">CISO • HyperScale</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 italic leading-snug">
                “Nexus streamlined our cryptographic identity pipeline within hours. Automated token rotation makes it effortless to scale.”
              </p>
            </div>

            {/* Security Compliance Pills */}
            <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-0.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>SOC-2 Type II</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>ISO 27001</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>End-to-End Encrypted</span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Authentication Card Container */}
          <div className="w-full lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>

        </div>
      </main>

      {/* Global Enterprise Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-2.5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 shrink-0">
        <div className="flex items-center gap-2 text-slate-500">
          <span>© 2026 Nexus Identity Technologies, Inc.</span>
          <span>•</span>
          <span>All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4">
          <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Privacy Policy: Enterprise-grade data protection."); }} className="hover:text-slate-200 transition-colors">Privacy Policy</a>
          <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Service: Standard enterprise SLA."); }} className="hover:text-slate-200 transition-colors">Terms of Service</a>
          <a href="#security" onClick={(e) => { e.preventDefault(); alert("Security: 256-bit encryption with SHA-256 HMAC."); }} className="hover:text-slate-200 transition-colors">Security Whitepaper</a>
        </div>
      </footer>
    </div>
  );
};
