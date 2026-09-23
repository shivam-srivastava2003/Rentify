import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.jpg';
import authImg from '../assets/auth.jpg';
import { Search, MapPin, Building2, ShieldCheck, Sparkles, ArrowRight, KeyRound, Users2, Star } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="bg-slate-50 text-slate-800 selection:bg-teal-500 selection:text-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-20 md:py-28">
        {/* Background Hero Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={heroImg}
            alt="Cozy Rentify Apartment Interior"
            className="w-full h-full object-cover object-center filter saturate-120"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-teal-950/85 to-slate-950"></div>
        </div>

        {/* Hero Decorative Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/20 rounded-full blur-3xl pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-teal-900/80 border border-teal-700/60 text-teal-200 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>India's Premier Room & PG Finding Ecosystem</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight md:leading-none mb-6">
            Find a Room or PG You'll <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-amber-300">Love to Call Home</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-12 font-normal leading-relaxed">
            Rentify connects verified property owners with verified tenants across top cities — direct connections, zero hidden charges, and tailored budget options.
          </p>

          {/* Search UI Mockup (Phase 1 Non-functional Preview) */}
          <div className="bg-white/95 backdrop-blur-xl p-4 md:p-6 rounded-3xl shadow-2xl max-w-4xl mx-auto text-slate-800 border border-slate-200/60">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* City Selection */}
              <div className="text-left bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Location</label>
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                  <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <select disabled className="bg-transparent w-full focus:outline-none cursor-not-allowed">
                    <option>Delhi NCR</option>
                    
                  </select>
                </div>
              </div>

              {/* Property Type */}
              <div className="text-left bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Property Type</label>
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                  <Building2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <select disabled className="bg-transparent w-full focus:outline-none cursor-not-allowed">
                    <option>Boys / Girls PG</option>
                    <option>Single Private Room</option>
                    <option>Shared Room</option>
                    <option>Full Apartment (1/2 BHK)</option>
                  </select>
                </div>
              </div>

              {/* Budget Range */}
              <div className="text-left bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Budget</label>
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                  <span className="text-teal-600 font-bold">₹</span>
                  <select disabled className="bg-transparent w-full focus:outline-none cursor-not-allowed">
                    <option>₹5,000 - ₹10,000</option>
                    <option>₹10,000 - ₹20,000</option>
                    <option>₹20,000+</option>
                  </select>
                </div>
              </div>

              {/* Search CTA */}
              <button
                disabled
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 opacity-80 cursor-not-allowed shadow-md"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              
              </button>
            </div>

          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-slate-800/80">
            <div>
              <div className="text-3xl font-extrabold text-white">1,000+</div>
              <div className="text-xs text-teal-200/80 font-medium mt-1">Verified Rooms</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">10+</div>
              <div className="text-xs text-teal-200/80 font-medium mt-1">Popular Cities</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">0%</div>
              <div className="text-xs text-teal-200/80 font-medium mt-1">Brokerage Options</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">99.8%</div>
              <div className="text-xs text-teal-200/80 font-medium mt-1">Satisfied Renters</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED VISUAL SHOWCASE */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Premium Community Living
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-4 mb-6 leading-tight">
                Experience Comfort & Security with Rentify
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                Whether you're moving to a new tech hub or searching for a peaceful PG close to your university, Rentify gives you transparent pricing, verified flatmates, and zero middlemen hassles.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-teal-100 text-teal-700 rounded-full mt-1">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Verified Property Listings</h4>
                    <p className="text-xs text-slate-500">Every single room photos and details are checked for 100% accuracy.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 bg-amber-100 text-amber-700 rounded-full mt-1">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Direct Landlord Contact</h4>
                    <p className="text-xs text-slate-500">No agents, no commission fees. Deal directly with property owners.</p>
                  </div>
                </div>
              </div>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-md"
              >
                <span>Find Your Next Home</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Visual Image Card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-teal-500/20 to-amber-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                <img
                  src={authImg}
                  alt="Rentify Happy Tenant Community"
                  className="w-full h-[450px] object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-6 text-white">
                  <div className="flex items-center gap-2 text-amber-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm italic font-medium text-slate-200">
                    "Finding a PG near my office used to be exhausting. With Rentify, I registered and connected directly with verified property owners in minutes!"
                  </p>
                  <p className="text-xs font-bold text-teal-400 mt-2">— Ananya R., Bengaluru</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY RENTIFY SECTION */}
      <section id="why-rentify" className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            Why Choose Us
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Designed for Modern Renters & Property Owners
          </h2>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto mb-16">
            Say goodbye to fake property listings, exorbitant brokerage fees, and endless back-and-forth calls. Rentify streamlines the entire housing search.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-teal-200 hover:shadow-xl transition-all text-left group">
              <div className="w-14 h-14 bg-teal-600/10 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-all">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">100% Verified Properties</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every listed room and PG undergoes identity and address validation before being published. No fake pictures or misleading prices.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-teal-200 hover:shadow-xl transition-all text-left group">
              <div className="w-14 h-14 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-all">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Direct Owner Connection</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Connect directly with property landlords and PG managers without middlemen. Save thousands on brokerage fees.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-teal-200 hover:shadow-xl transition-all text-left group">
              <div className="w-14 h-14 bg-teal-600/10 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-all">
                <Users2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Tailored Roommate Matching</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Find roommates who match your lifestyle, food preferences, work schedule, and budget effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DUAL CTA SECTION */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-teal-900 to-teal-800 text-white p-10 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-950/60 px-3 py-1 rounded-full">For Tenants & Students</span>
                <h3 className="text-2xl md:text-3xl font-bold mt-4 mb-3">Looking for a Room or PG?</h3>
                <p className="text-teal-100 text-sm leading-relaxed mb-8">
                  Create your free tenant profile today to save favorite properties and get early access to Phase 2 verified room listings.
                </p>
              </div>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3.5 rounded-xl transition-all shadow-md w-fit"
              >
                <span>Find Your Room</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white border border-slate-200 text-slate-900 p-10 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">For Landlords & PG Owners</span>
                <h3 className="text-2xl md:text-3xl font-bold mt-4 mb-3">Want to List Your Property?</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-8">
                  Join thousands of verified owners managing their properties and receiving zero-brokerage enquiries directly on Rentify.
                </p>
              </div>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-md w-fit"
              >
                <span>Register as Property Owner</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Home;
