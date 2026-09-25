import React from 'react';
import { useApp } from '../../context/AppContext';
import { Pushpin } from '../common/Pushpin';
import { WashiTape } from '../common/WashiTape';
import {
  Users,
  ShieldCheck,
  ArrowRight,
  PlusCircle,
  Lock,
} from 'lucide-react';

export const RoleSplitScreen: React.FC = () => {
  const {
    navigateTo,
    setUserRole,
    isVolunteerLoggedIn,
    isAdminLoggedIn,
    isCommunityLoggedIn,
  } = useApp();

  const handleChooseCommunity = () => {
    setUserRole('community');
    if (isCommunityLoggedIn) {
      navigateTo('report-problem');
    } else {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('post_community_login_redirect', 'report-problem');
      }
      navigateTo('community-login');
    }
  };

  const handleChooseVolunteer = () => {
    setUserRole('volunteer');
    if (isVolunteerLoggedIn) {
      navigateTo('volunteer-dashboard');
    } else {
      navigateTo('volunteer-signin');
    }
  };

  const handleChooseAdmin = () => {
    setUserRole('admin');
    if (isAdminLoggedIn) {
      navigateTo('admin');
    } else {
      navigateTo('admin-login');
    }
  };

  return (
    <div className="min-h-full flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-5xl xl:max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="text-center space-y-2 relative mb-8 sm:mb-10">
        <div className="inline-block relative">
          <span className="font-['Caveat'] text-2xl sm:text-3xl text-[#A03818] font-bold block -rotate-2">
            Community Noticeboard Portal
          </span>
          <div className="absolute -top-3 -right-6">
            <Pushpin color="mustard" size="sm" />
          </div>
        </div>
        <h1 className="font-['Epilogue'] font-black text-2xl sm:text-4xl text-[#1F1B17] tracking-tight">
          How are you joining today?
        </h1>
        <p className="text-xs sm:text-sm text-[#57423C] max-w-md mx-auto leading-relaxed">
          Select your portal to continue. Report local concerns or take civic action with your collegiate squad.
        </p>
      </div>

      {/* The Two Large Side-by-Side Cards (Equal structure, height, and spacing) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch w-full pt-6 mt-2 mb-4">
        
        {/* ================= CARD 1: COMMUNITY RESIDENT ================= */}
        <div className="relative bg-[#FFFDF8] border-2 border-[#DEC0B8] rounded-2xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(43,38,34,0.06)] md:-rotate-0.5 transition-all flex flex-col justify-between h-full overflow-visible">
          {/* Top decorations (positioned with sufficient room so pins and tapes are completely visible and not cut off) */}
          <div className="absolute -top-3.5 right-8 z-20">
            <Pushpin color="rust" size="md" />
          </div>
          <div className="absolute -top-2.5 left-6 z-20">
            <WashiTape color="peach" width="w-16" />
          </div>

          <div className="space-y-4">
            {/* 1. Icon & 2. Title only (No eyebrow tag) */}
            <div className="flex items-center gap-3 pt-1">
              <div className="w-11 h-11 rounded-xl bg-[#FFDBD1] border border-[#A03818]/40 flex items-center justify-center text-[#A03818] shrink-0 shadow-2xs">
                <Users className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h2 className="font-['Epilogue'] font-black text-xl sm:text-2xl text-[#1F1B17] leading-tight">
                Community Resident
              </h2>
            </div>

            {/* 3. ONE short tagline only */}
            <p className="font-['Epilogue'] font-extrabold text-sm text-[#A03818] leading-snug">
              Snap, pin, post &amp; track neighborhood fixes.
            </p>

            {/* 6. Exactly 2 checklist items under 6 words */}
            <div className="space-y-2 text-xs font-medium text-[#1F1B17] pt-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#FFDBD1] text-[#A03818] flex items-center justify-center text-[10px] font-black shrink-0">
                  ✓
                </div>
                <span>Report problems in seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#FFDBD1] text-[#A03818] flex items-center justify-center text-[10px] font-black shrink-0">
                  ✓
                </div>
                <span>Track fixes with photo proof</span>
              </div>
            </div>
          </div>

          {/* 7. ONE primary button only */}
          <div className="pt-5 mt-4">
            <button
              onClick={handleChooseCommunity}
              className="w-full py-3.5 px-5 rounded-xl font-['Epilogue'] font-black text-sm tracking-wide cork-btn-primary flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <PlusCircle className="w-4.5 h-4.5 stroke-[2.5]" />
              <span>Voice a Problem</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= CARD 2: NSS VOLUNTEER CADET ================= */}
        <div className="relative bg-[#FFFDF8] border-2 border-[#B8EADE] rounded-2xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(43,38,34,0.06)] md:rotate-0.5 transition-all flex flex-col justify-between h-full overflow-visible">
          {/* Top decorations (positioned with sufficient room so pins and tapes are completely visible and not cut off) */}
          <div className="absolute -top-3.5 left-8 z-20">
            <Pushpin color="teal" size="md" />
          </div>
          <div className="absolute -top-2.5 right-6 z-20">
            <WashiTape color="mint" width="w-16" />
          </div>

          <div className="space-y-4">
            {/* 1. Icon & 2. Title only (No eyebrow tag) */}
            <div className="flex items-center gap-3 pt-1">
              <div className="w-11 h-11 rounded-xl bg-[#B8EADE] border border-[#38665E]/40 flex items-center justify-center text-[#1B4B43] shrink-0 shadow-2xs">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h2 className="font-['Epilogue'] font-black text-xl sm:text-2xl text-[#1F1B17] leading-tight">
                NSS Volunteer
              </h2>
            </div>

            {/* 3. ONE short tagline only */}
            <p className="font-['Epilogue'] font-extrabold text-sm text-[#1B4B43] leading-snug">
              Not Me But You – Civic Action Squad.
            </p>

            {/* 6. Exactly 2 checklist items under 6 words */}
            <div className="space-y-2 text-xs font-medium text-[#1F1B17] pt-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#B8EADE] text-[#1B4B43] flex items-center justify-center text-[10px] font-black shrink-0">
                  ✓
                </div>
                <span>Claim and complete tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#B8EADE] text-[#1B4B43] flex items-center justify-center text-[10px] font-black shrink-0">
                  ✓
                </div>
                <span>Log hours &amp; photo proof</span>
              </div>
            </div>
          </div>

          {/* 7. ONE primary button only */}
          <div className="pt-5 mt-4">
            <button
              onClick={handleChooseVolunteer}
              className="w-full py-3.5 px-5 rounded-xl font-['Epilogue'] font-black text-sm tracking-wide cork-btn-teal flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <ShieldCheck className="w-4.5 h-4.5 stroke-[2.5]" />
              <span>
                {isVolunteerLoggedIn ? 'Open Volunteer Hub' : 'Sign In as Volunteer'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ONE shared note line below BOTH cards, centered */}
      <p className="text-center text-xs text-[#7C695E] mb-6">
        Official NSS Unit credentials required for volunteer portal sign-in
      </p>

      {/* ================= PROGRAMME OFFICER LOGIN (MORE VISUAL PRESENCE) ================= */}
      <div className="relative bg-[#FFFDF8] border border-[#DEC0B8] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-lg bg-[#FAF6ED] border border-[#DEC0B8] flex items-center justify-center text-[#A03818] shrink-0">
            <Lock className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-['Epilogue'] font-black text-sm text-[#1F1B17]">
              NSS Programme Officer &amp; Coordinator Portal
            </h3>
            <p className="text-xs text-[#6E5A4E]">
              Restricted to verified NSS Programme Officers, University Directors &amp; Unit Coordinators.
            </p>
          </div>
        </div>

        <button
          onClick={handleChooseAdmin}
          className="w-full sm:w-auto shrink-0 py-2 px-4 rounded-lg bg-[#FAF6ED] border border-[#DEC0B8] hover:bg-[#FFDBD1]/30 text-xs font-['Epilogue'] font-bold text-[#A03818] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
        >
          <span>
            {isAdminLoggedIn
              ? 'Open Officer Panel'
              : 'Programme Officer Login'}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Back to landing page */}
      <div className="mt-6 text-center">
        <button
          onClick={() => navigateTo('welcome')}
          className="text-xs font-semibold text-[#8C7A70] hover:text-[#1F1B17] transition-colors cursor-pointer"
        >
          ← Return to Landing Page
        </button>
      </div>

    </div>
  );
};
