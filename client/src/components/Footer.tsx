import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import {
  MapPin,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Code2,
  Cpu,
  CheckCircle2
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 mt-auto font-sans relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* COLUMN 1 & 2: BRAND, LOGO & STATEMENT (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo light={true} size="md" />

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Rentify is a premier zero-brokerage property and PG finding platform. We connect working professionals, students, and families directly with verified property owners across major Indian hubs with complete transparency.
            </p>

            {/* TRUST BADGES */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 bg-teal-950/80 border border-teal-800/60 text-teal-300 text-[11px] font-bold px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> 100% Zero Brokerage
              </span>
              <span className="inline-flex items-center gap-1 bg-amber-950/80 border border-amber-800/60 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Direct WhatsApp Connect
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-bold px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Listings
              </span>
            </div>
          </div>

          {/* COLUMN 3: IMPORTANT NAVBAR NAVIGATION LINKS */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800/80 pb-2">
              Quick Navigation
            </h3>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link to="/" className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-teal-500" /> Home Page
                </Link>
              </li>
              <li>
                <Link to="/find-rooms" className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-teal-500" /> Find Rooms & PGs
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-teal-500" /> Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-teal-500" /> Register Account
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-teal-500" /> Account Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: LANDLORD & PROPERTY OWNER LINKS */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800/80 pb-2">
              For Property Owners
            </h3>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link to="/owner/dashboard" className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-amber-400" /> Post Free Listing
                </Link>
              </li>
              <li>
                <Link to="/owner/dashboard" className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-amber-400" /> Owner Dashboard
                </Link>
              </li>
              <li>
                <Link to="/owner/properties" className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-amber-400" /> My Listed Properties
                </Link>
              </li>
              <li>
                <Link to="/owner/profile" className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-amber-400" /> Owner Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 5: POPULAR CITIES */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800/80 pb-2">
              Popular Cities
            </h3>
            <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
              <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-400" /> Bengaluru
              </span>
              <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-400" /> Mumbai
              </span>
              <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-400" /> Delhi NCR
              </span>
              <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-400" /> Hyderabad
              </span>
              <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-400" /> Pune
              </span>
              <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-400" /> Gurugram
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM DEVELOPER CREDIT BAR */}
      <div className="border-t border-slate-800/90 bg-slate-950/95 py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* COPYRIGHT */}
          <div className="text-xs text-slate-400 font-semibold text-center md:text-left">
            &copy; {new Date().getFullYear()} <span className="text-white font-extrabold">Rentify Platform</span>. All rights reserved.
          </div>

          {/* DEVELOPER ATTRIBUTION BADGE - SHIVAM SRIVASTAVA */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 px-4 py-2.5 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-md">
                SS
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Website Developer</span>
                <span className="text-xs font-black text-white tracking-wide">Shivam Srivastava</span>
              </div>
            </div>

            <div className="hidden sm:block h-6 w-px bg-slate-800 mx-1"></div>

            {/* TECH SKILLS */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-[11px]">
              <span className="inline-flex items-center gap-1 bg-teal-950/90 text-teal-300 font-extrabold px-2.5 py-1 rounded-lg border border-teal-800/60 shadow-xs">
                <Code2 className="w-3 h-3 text-teal-400" /> Full Stack Web Developer
              </span>
              <span className="inline-flex items-center gap-1 bg-amber-950/90 text-amber-300 font-extrabold px-2.5 py-1 rounded-lg border border-amber-800/60 shadow-xs">
                <Cpu className="w-3 h-3 text-amber-400" /> AI Automation & Agent Engineering
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
