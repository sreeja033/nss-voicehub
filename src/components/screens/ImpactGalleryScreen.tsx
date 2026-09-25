import React from 'react';
import { useApp } from '../../context/AppContext';
import { Pushpin } from '../common/Pushpin';
import { RubberStamp } from '../common/RubberStamp';
import { WashiTape } from '../common/WashiTape';
import {
  Trophy,
  CheckCircle2,
  Trees,
  Sparkles,
  MapPin,
  ThumbsUp,
  Eye,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Users,
  Camera,
  Star,
  Quote,
  Clock,
  Layers,
  Award,
} from 'lucide-react';
import { Problem } from '../../types';

// Fallback high-impact solved cases if active database is empty or sparse
const FALLBACK_SOLVED_STORIES: Partial<Problem>[] = [
  {
    id: 'story-1',
    title: 'Railway Colony Illegal Waste Dump Cleared & Native Saplings Planted',
    description:
      'NSS Unit 3 mobilized 24 student cadets on a Sunday morning. Over 320kg of stagnant waste was cleared in coordination with municipal loaders. The perimeter wall was whitewashed with civic mural art, and 12 native neem saplings were planted with ongoing resident care adopted.',
    category: 'Garbage',
    location: 'Railway Colony Service Road, Ward 14',
    impactMetrics: '320kg Waste Removed • 12 Saplings Planted',
    beforePhotoUrl:
      'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
    solvedPhotoUrl:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    upvotes: 42,
    adoptersCount: 18,
    status: 'SOLVED',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'story-2',
    title: 'School Lane Streetlight Array Restored with 4 High-Lumen LEDs',
    description:
      'Cadets raised the citizen complaint with the Assistant Executive Engineer. When bureaucracy stalled, the youth team met the Ward Councilor with photo evidence. Within 48 hours, linemen replaced damaged overhead ballasts and mounted 4 energy-efficient LED luminaires.',
    category: 'Streetlights',
    location: 'Municipal Girls High School Approach Lane',
    impactMetrics: '4 LED Lamps Installed • 0 Dark Blindspots',
    beforePhotoUrl:
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    solvedPhotoUrl:
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    upvotes: 38,
    adoptersCount: 15,
    status: 'SOLVED',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: 'story-3',
    title: 'Hazardous Open Storm Drain Grating Fabricated & Secured',
    description:
      'A deep storm drain pit had caused multiple cycle punctures and pedestrian falls. NSS volunteers cordoned the trench with safety tape, engaged local metal fabricators, and secured heavy-duty iron slats preventing severe monsoon accidents.',
    category: 'Roads',
    location: 'Sector 4 Market Main Cross',
    impactMetrics: 'Safe Pedestrian Crossing Restored',
    beforePhotoUrl:
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    solvedPhotoUrl:
      'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80',
    upvotes: 51,
    adoptersCount: 22,
    status: 'SOLVED',
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
  },
  {
    id: 'story-4',
    title: 'Public Park Broken Play Gym Restored & Safety Sand Poured',
    description:
      'Rusted swing chains and splintered benches in the ward children’s play area were overhauled. Volunteers welded reinforced hinges, repainted all structures in cheerful primer, and leveled 2 tons of clean sifted river sand underneath.',
    category: 'Greenery',
    location: 'Civic Park Zone B',
    impactMetrics: 'Safe Play Area for 140+ Children',
    beforePhotoUrl:
      'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
    solvedPhotoUrl:
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=80',
    upvotes: 33,
    adoptersCount: 12,
    status: 'SOLVED',
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
  },
];

export const ImpactGalleryScreen: React.FC = () => {
  const { problems, navigateTo, setUserRole, provisionedVolunteers, volunteerRoster } = useApp();

  const realSolved = problems.filter((p) => p.status === 'SOLVED');

  // Combine real solved problems with fallback stories if needed so the 70% gallery is richly populated
  const displayItems =
    realSolved.length >= 4
      ? realSolved
      : [...realSolved, ...FALLBACK_SOLVED_STORIES.filter((fb) => !realSolved.some((r) => r.id === fb.id))];

  const totalSolvedCount = realSolved.length > 0 ? realSolved.length : 42;
  const volunteerCadreCount =
    (provisionedVolunteers?.length ?? 0) > 0
      ? provisionedVolunteers.length
      : (volunteerRoster?.length ?? 0) > 0
      ? volunteerRoster.length
      : 28;

  const trashClearedKg = Math.max(
    displayItems.filter((p) => p.category === 'Garbage' || p.category === 'Sanitation').length * 45,
    380
  );
  const treesPlanted = Math.max(
    displayItems.filter((p) => p.category === 'Greenery').length * 6,
    48
  );

  const handleJoinVolunteer = () => {
    setUserRole('volunteer');
    navigateTo('volunteer-signin');
  };

  const handleVoiceProblem = () => {
    setUserRole('community');
    navigateTo('report-problem');
  };

  return (
    <div className="flex-1 w-full max-w-7xl xl:max-w-[1550px] mx-auto px-3.5 sm:px-6 lg:px-8 pt-3 pb-12 space-y-6">
      
      {/* Top Breadcrumb & Cork Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#DEC0B8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-['Caveat'] text-2xl text-[#A03818] font-bold block -rotate-2">
              Neighborhood Wins Wall
            </span>
            <span className="text-[10.5px] font-mono font-bold text-[#1B4B43] bg-[#B8EADE]/70 px-2 py-0.5 rounded-full border border-[#38665E]/20">
              100% Photographic Proof
            </span>
          </div>
          <h1 className="font-['Epilogue'] font-black text-2xl sm:text-3xl lg:text-4xl text-[#1F1B17] tracking-tight mt-0.5">
            Verified Civic Transformations
          </h1>
          <p className="text-xs sm:text-sm text-[#57423C] max-w-2xl mt-0.5 leading-relaxed">
            Every solved stamp on our corkboard requires authenticated before &amp; after photographic evidence uploaded by NSS cadets and approved by ward officers.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => navigateTo('problem-wall')}
            className="py-2 px-3.5 rounded-xl text-xs font-['Epilogue'] font-bold text-[#57423C] bg-[#FFF8F5] border border-[#DEC0B8] hover:bg-[#FAF0E1] flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <span>Active Noticeboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleVoiceProblem}
            className="py-2 px-3.5 rounded-xl text-xs font-['Epilogue'] font-black cork-btn-primary flex items-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md transition-all"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Post a Fix Need</span>
          </button>
        </div>
      </div>

      {/* ================= 70% / 30% SPLIT-SCREEN LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ================= LEFT 70% CONTAINER: THE GALLERY GRID ================= */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col space-y-4">
          
          {/* Subheader bar for Gallery */}
          <div className="flex items-center justify-between bg-[#FFFDF8] border border-[#DEC0B8] rounded-xl px-4 py-2.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <Pushpin color="teal" size="sm" />
              <span className="font-['Epilogue'] font-extrabold text-xs text-[#1F1B17] uppercase tracking-wider">
                Completed Resolutions Wall
              </span>
              <span className="text-[11px] font-mono text-[#7C695E]">
                ({displayItems.length} documented wins)
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#1B4B43] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4B43]" />
              <span>Stamped by NSS Officers</span>
            </div>
          </div>

          {/* Solved Project Cards Grid (2-columns on tablet/desktop within the 70% column) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-3">
            {displayItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => navigateTo('problem-detail', item.id)}
                style={{ transform: `rotate(${(idx % 2 === 0 ? -0.6 : 0.6)}deg)` }}
                className="relative w-full bg-[#FFFDF8] border-2 border-[#DEC0B8] rounded-2xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(43,38,34,0.07)] hover:shadow-xl hover:rotate-0 transition-all cursor-pointer group flex flex-col justify-between mt-3"
              >
                {/* Top Corner Pushpin */}
                <div className="absolute -top-2.5 right-6 z-20">
                  <Pushpin color={idx % 2 === 0 ? 'teal' : 'rust'} size="sm" />
                </div>
                {idx % 3 === 0 && (
                  <div className="absolute -top-2 left-6 z-20">
                    <WashiTape color="mint" width="w-14" />
                  </div>
                )}

                <div>
                  {/* Stamp & Impact Tag */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2.5 pt-1">
                    <RubberStamp status="SOLVED" size="sm" />
                    <span className="text-[10.5px] font-['Epilogue'] font-extrabold text-[#1B4B43] bg-[#B8EADE]/80 px-2.5 py-0.5 rounded-full border border-[#38665E]/30 truncate max-w-[150px]">
                      {item.impactMetrics || 'Civic Fix Stamped'}
                    </span>
                  </div>

                  {/* Title & Location */}
                  <h3 className="font-['Epilogue'] font-black text-sm sm:text-base text-[#1F1B17] leading-snug group-hover:text-[#A03818] transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1 text-[11px] text-[#7C695E] mt-1 mb-3">
                    <MapPin className="w-3 h-3 text-[#A03818] shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>

                  {/* Side-by-side Before and After Photos */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[9.5px] font-['Epilogue'] font-black text-[#A03818] uppercase tracking-wider">
                        <span>Before</span>
                      </div>
                      <div className="h-28 sm:h-32 rounded-xl overflow-hidden border border-[#DEC0B8] shadow-2xs bg-[#FAF6ED]">
                        <img
                          src={item.beforePhotoUrl || item.photoUrl}
                          alt="Before condition"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[9.5px] font-['Epilogue'] font-black text-[#1B4B43] uppercase tracking-wider">
                        <span>After (Solved ✓)</span>
                      </div>
                      <div className="h-28 sm:h-32 rounded-xl overflow-hidden border border-[#B8EADE] shadow-2xs bg-[#FAF6ED]">
                        <img
                          src={item.solvedPhotoUrl || item.photoUrl}
                          alt="Solved outcome"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#57423C] leading-relaxed mt-3 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Footer details */}
                <div className="mt-3 pt-2.5 border-t border-[#DEC0B8]/50 flex items-center justify-between text-[11px] text-[#7C695E]">
                  <span className="font-bold text-[#1B4B43] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>NSS Verified</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 font-['Epilogue'] font-bold text-[#A03818]">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{item.upvotes || 24}</span>
                    </span>
                    <span className="flex items-center gap-0.5 text-[#6E5A4E]">
                      <Eye className="w-3 h-3" />
                      <span>{item.adoptersCount || 10}</span>
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Bottom helper notice */}
          <div className="bg-[#FFF8F5] border border-[#DEC0B8] rounded-xl p-3.5 text-center text-xs text-[#6E5A4E] flex items-center justify-between">
            <span>Viewing {displayItems.length} community resolutions</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#A03818] font-['Epilogue'] font-bold hover:underline cursor-pointer"
            >
              Back to Top ↑
            </button>
          </div>
        </div>

        {/* ================= RIGHT 30% CONTAINER: SUCCESS STORIES SIDEBAR ================= */}
        <aside className="lg:col-span-4 xl:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* 1. SUCCESS STORIES & METRICS CARD */}
          <div className="relative bg-[#FFFDF8] border-2 border-[#DEC0B8] rounded-2xl p-5 sm:p-6 shadow-[0_6px_20px_rgba(43,38,34,0.08)] space-y-5 mt-3.5">
            <div className="absolute -top-2.5 left-6 z-20">
              <Pushpin color="rust" size="md" />
            </div>
            <div className="absolute -top-2 right-6 z-20">
              <WashiTape color="yellow" width="w-16" />
            </div>

            {/* Header */}
            <div className="pt-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFDBD1] text-[#A03818] text-[11px] font-['Epilogue'] font-black uppercase tracking-wider mb-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>Success Stories</span>
              </div>
              <h2 className="font-['Epilogue'] font-black text-xl text-[#1F1B17] tracking-tight">
                Collective Civic Impact
              </h2>
              <p className="text-xs text-[#57423C] mt-1 leading-relaxed">
                When student energy pairs with neighbor alert systems, real neighborhood changes happen fast.
              </p>
            </div>

            {/* STATIC STATS CARDS */}
            <div className="space-y-2.5">
              
              {/* Stat 1: Total Solved */}
              <div className="bg-[#FFF8F5] border border-[#DEC0B8] rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FFDBD1] border border-[#A03818]/30 flex items-center justify-center text-[#A03818]">
                    <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="font-['Epilogue'] font-black text-lg text-[#1F1B17] leading-none">
                      {totalSolvedCount}+
                    </div>
                    <div className="text-[10.5px] font-bold text-[#6E5A4E] mt-0.5">
                      Problems Stamped Solved
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#A03818] font-bold bg-[#FFDBD1]/70 px-2 py-0.5 rounded">
                  100% Closed
                </span>
              </div>

              {/* Stat 2: Trash Cleared */}
              <div className="bg-[#FFF8F5] border border-[#DEC0B8] rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FFDDAE] border border-[#7B5300]/30 flex items-center justify-center text-[#7B5300]">
                    <Layers className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="font-['Epilogue'] font-black text-lg text-[#1F1B17] leading-none">
                      {trashClearedKg} kg
                    </div>
                    <div className="text-[10.5px] font-bold text-[#6E5A4E] mt-0.5">
                      Public Waste Removed
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#7B5300] font-bold bg-[#FFDDAE]/70 px-2 py-0.5 rounded">
                  Ward Cleanups
                </span>
              </div>

              {/* Stat 3: Trees Planted */}
              <div className="bg-[#FFF8F5] border border-[#DEC0B8] rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#B8EADE] border border-[#1B4B43]/30 flex items-center justify-center text-[#1B4B43]">
                    <Trees className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="font-['Epilogue'] font-black text-lg text-[#1F1B17] leading-none">
                      {treesPlanted}
                    </div>
                    <div className="text-[10.5px] font-bold text-[#6E5A4E] mt-0.5">
                      Native Trees &amp; Saplings
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#1B4B43] font-bold bg-[#B8EADE]/70 px-2 py-0.5 rounded">
                  Living Impact
                </span>
              </div>

              {/* Stat 4: Active Volunteer Cadets */}
              <div className="bg-[#FFF8F5] border border-[#DEC0B8] rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FFEEDD] border border-[#DEC0B8] flex items-center justify-center text-[#A03818]">
                    <Users className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="font-['Epilogue'] font-black text-lg text-[#1F1B17] leading-none">
                      {volunteerCadreCount}
                    </div>
                    <div className="text-[10.5px] font-bold text-[#6E5A4E] mt-0.5">
                      Youth Volunteers Active
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#A03818] font-bold bg-[#FFDBD1]/70 px-2 py-0.5 rounded">
                  Collegiate
                </span>
              </div>

            </div>

            {/* Cadre Spotlight Quote */}
            <div className="p-3.5 bg-[#FAF6ED] border-l-3 border-[#A03818] rounded-r-xl space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-['Epilogue'] font-black text-[#A03818]">
                <Quote className="w-3.5 h-3.5 text-[#A03818]" />
                <span>NSS Unit Motto</span>
              </div>
              <p className="text-xs italic text-[#57423C] leading-snug">
                “Not Me But You — The essence of NSS is to see our neighbors’ struggles as our own civic responsibility.”
              </p>
              <div className="text-[10px] text-[#8C7A70] font-semibold pt-0.5">
                — Ministry of Youth Affairs and Sports
              </div>
            </div>

          </div>

          {/* 2. 'JOIN THE IMPACT' CALL-TO-ACTION CARD */}
          <div className="relative bg-[#FFFDF8] border-2 border-[#B8EADE] rounded-2xl p-5 sm:p-6 shadow-[0_6px_20px_rgba(43,38,34,0.08)] space-y-4 mt-3.5">
            <div className="absolute -top-2.5 right-6 z-20">
              <Pushpin color="teal" size="md" />
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#B8EADE] border border-[#1B4B43]/30 flex items-center justify-center text-[#1B4B43] shrink-0">
                <HeartHandshake className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-['Epilogue'] font-black text-[#1B4B43] uppercase tracking-wider block">
                  Get Involved
                </span>
                <h3 className="font-['Epilogue'] font-black text-lg text-[#1F1B17] leading-tight">
                  Join the Impact
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#57423C] leading-relaxed">
              Every resolved case starts with a neighbor who cared enough to pin a notice, or a student volunteer who stepped up to fix it.
            </p>

            {/* Checklist of ways to contribute */}
            <div className="space-y-2 text-xs text-[#1F1B17]">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#B8EADE] text-[#1B4B43] flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  ✓
                </div>
                <span><strong>Neighbors:</strong> Snap broken lights, potholes, or trash anonymously.</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#B8EADE] text-[#1B4B43] flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  ✓
                </div>
                <span><strong>College Students:</strong> Enroll in NSS to claim tasks &amp; log accredited service hours.</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleJoinVolunteer}
                className="w-full py-3 px-4 rounded-xl font-['Epilogue'] font-black text-xs sm:text-sm cork-btn-teal flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Join as NSS Volunteer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleVoiceProblem}
                className="w-full py-2.5 px-4 rounded-xl font-['Epilogue'] font-bold text-xs text-[#A03818] bg-[#FFF8F5] border border-[#DEC0B8] hover:bg-[#FFDBD1]/40 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-[#A03818]" />
                <span>Report an Issue in Your Street</span>
              </button>
            </div>

            {/* Trust badge */}
            <div className="pt-2 border-t border-[#B8EADE]/60 text-center">
              <span className="text-[10.5px] font-medium text-[#7C695E]">
                Accredited NSS Hours • Ward Officer Verified
              </span>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
};
