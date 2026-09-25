import React from 'react';
import { useApp } from '../../context/AppContext';
import { NSS_SEAL_URL } from '../../data/mockData';
import { Pushpin } from '../common/Pushpin';
import { WashiTape } from '../common/WashiTape';
import { RubberStamp } from '../common/RubberStamp';
import { ProblemCard } from '../common/ProblemCard';
import {
  PlusCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Camera,
  MapPin,
  CheckCircle2,
  HeartHandshake,
  Users,
  Trophy,
  Clock,
  Instagram,
  Mail,
  GraduationCap,
} from 'lucide-react';
import { Problem } from '../../types';
import { formatDateChip } from '../../utils/dateUtils';

export const WelcomeScreen: React.FC = () => {
  const {
    navigateTo,
    setUserRole,
    problems,
    isVolunteerLoggedIn,
    isAdminLoggedIn,
    provisionedVolunteers,
    volunteerRoster,
    currentVolunteer,
  } = useApp();

  // === REAL DATA QUERIES ===
  // Section 1: Active, unsolved problems (strictly NOT solved, NOT rejected, NOT pending review)
  const activeProblems: Problem[] = problems
    .filter((p) => {
      const isUnsolved = p.status === 'REPORTED' || p.status === 'IN_PROGRESS';
      const isNotSolved = p.status !== 'SOLVED';
      const isNotRejected = p.status !== 'REJECTED' && p.moderationStatus !== 'REJECTED';
      const isApproved =
        p.status !== 'PENDING_REVIEW' &&
        p.moderationStatus !== 'PENDING' &&
        p.isApproved !== false;
      return isUnsolved && isNotSolved && isNotRejected && isApproved;
    })
    .sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0));

  // Section 2: Solved problems (strictly solved status)
  const solvedProblems: Problem[] = problems.filter((p) => p.status === 'SOLVED');

  // Dynamic Real-Time Stats (computed strictly from live application state)
  const solvedCount = solvedProblems.length;

  // Active volunteers: strictly count active NSS collegiate volunteers in the roster/system
  const activeCadre = (provisionedVolunteers || []).filter((v) => v.status === 'ACTIVE');
  const isCurrentVolunteerActive =
    isVolunteerLoggedIn &&
    Boolean(currentVolunteer?.id || currentVolunteer?.name) &&
    !(provisionedVolunteers || []).some(
      (v) => v.id === currentVolunteer?.id || (v.email && v.email === currentVolunteer?.email)
    );
  const volunteerCount = activeCadre.length + (isCurrentVolunteerActive ? 1 : 0);

  // Verified Reports Percentage (strictly calculated from legitimate, unflagged, approved community notices)
  const totalReports = problems.length;
  const verifiedReports = problems.filter(
    (p) =>
      p.isApproved !== false &&
      p.moderationStatus !== 'REJECTED' &&
      p.status !== 'REJECTED' &&
      !p.aiPhotoFlagged &&
      (p.flagCount ?? 0) === 0 &&
      !p.flaggedReason
  );
  const verifiedPercentage =
    totalReports > 0 ? `${Math.round((verifiedReports.length / totalReports) * 100)}%` : '100%';

  // Average Response Time: calculated lively from elapsed time between report creation and volunteer triage/response
  const respondedProblems = problems.filter((p) => {
    return (
      p.status === 'IN_PROGRESS' ||
      p.status === 'SOLVED' ||
      Boolean(p.assignedLead) ||
      Boolean(p.assignedToVolunteerId) ||
      Boolean(p.assignedSquad) ||
      (p.updates && p.updates.length > 0)
    );
  });

  let avgResponseText = '< 24 hrs';
  if (respondedProblems.length > 0) {
    let totalHours = 0;
    let validCount = 0;

    respondedProblems.forEach((p) => {
      const createdTime = new Date(p.createdAt).getTime();
      if (!isNaN(createdTime)) {
        let firstActionTime: number | null = null;
        if (p.updates && p.updates.length > 0) {
          const updateTime = new Date(p.updates[0].timestamp).getTime();
          if (!isNaN(updateTime) && updateTime >= createdTime) {
            firstActionTime = updateTime;
          }
        }
        if (!firstActionTime && (p.resolvedAt || p.resolved_at)) {
          const resTime = new Date(p.resolvedAt || p.resolved_at || '').getTime();
          if (!isNaN(resTime) && resTime >= createdTime) {
            firstActionTime = resTime;
          }
        }
        if (!firstActionTime) {
          const elapsed = Math.max(0.5, (Date.now() - createdTime) / (1000 * 3600));
          totalHours += elapsed;
          validCount++;
          return;
        }

        const diffHours = Math.max(0.5, (firstActionTime - createdTime) / (1000 * 3600));
        totalHours += diffHours;
        validCount++;
      }
    });

    if (validCount > 0) {
      const avg = totalHours / validCount;
      if (avg < 1) {
        const mins = Math.max(10, Math.round(avg * 60));
        avgResponseText = `${mins} mins`;
      } else if (avg < 24) {
        const hrs = Math.max(1, Math.round(avg));
        avgResponseText = `${hrs} hr${hrs === 1 ? '' : 's'}`;
      } else {
        const days = Math.round(avg / 24);
        avgResponseText = `${days * 24} hrs`;
      }
    }
  } else if (totalReports > 0) {
    // Reports exist but awaiting first squad response
    const validTimestamps = problems
      .map((p) => new Date(p.createdAt).getTime())
      .filter((t) => !isNaN(t));
    if (validTimestamps.length > 0) {
      const oldestTime = Math.min(...validTimestamps);
      const pendingHours = Math.max(1, Math.round((Date.now() - oldestTime) / (1000 * 3600)));
      avgResponseText = pendingHours < 24 ? `< ${pendingHours + 1} hrs` : `${pendingHours} hrs`;
    } else {
      avgResponseText = '< 24 hrs';
    }
  }

  const handleGetStartedClick = () => {
    navigateTo('role-split');
  };

  const handleVolunteerClick = () => {
    setUserRole('volunteer');
    if (isVolunteerLoggedIn) {
      navigateTo('volunteer-dashboard');
    } else {
      navigateTo('volunteer-signin');
    }
  };

  const handleAdminClick = () => {
    setUserRole('admin');
    if (isAdminLoggedIn) {
      navigateTo('admin');
    } else {
      navigateTo('admin-login');
    }
  };

  const handleReportProblemClick = () => {
    setUserRole('community');
    navigateTo('report-problem');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Top items for Hero preview glimpse (uses real data if available)
  const heroActive = activeProblems[0];
  const heroSolved = solvedProblems[0];

  return (
    <div className="w-full min-h-screen flex flex-col cork-pattern text-[#1F1B17] selection:bg-[#FFDBD1] selection:text-[#A03818]">
      
      {/* ================= 1. TOP NAV BAR (PERSISTENT, FULL WIDTH) ================= */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFDF8] border-b-2 border-[#DEC0B8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          
          {/* Left: NSS Seal + Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 bg-[#FFFDF8] border-2 border-[#A03818] shrink-0">
              <img
                src={NSS_SEAL_URL}
                alt="National Service Scheme Seal"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-['Epilogue'] font-black text-lg sm:text-xl text-[#1F1B17] tracking-tight">
                  NSS Voice
                </span>
                <span className="hidden sm:inline text-[10px] font-mono font-bold text-[#A03818] bg-[#FFDBD1] px-2 py-0.2 rounded-full border border-[#A03818]/20">
                  Civic Desk
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-[#7C695E] leading-none mt-0.5">
                Community Noticeboard
              </p>
            </div>
          </div>

          {/* Center/Right: Anchor Nav Links */}
          <nav className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="touch-target px-2 text-xs font-['Epilogue'] font-bold text-[#57423C] hover:text-[#A03818] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('live-preview')}
              className="touch-target px-2 text-xs font-['Epilogue'] font-bold text-[#57423C] hover:text-[#A03818] transition-colors cursor-pointer"
            >
              Live Board
            </button>
            <button
              onClick={() => scrollToSection('recently-solved')}
              className="touch-target px-2 text-xs font-['Epilogue'] font-bold text-[#57423C] hover:text-[#A03818] transition-colors cursor-pointer"
            >
              Impact
            </button>
            <button
              onClick={() => navigateTo('about')}
              className="touch-target px-2 text-xs font-['Epilogue'] font-bold text-[#57423C] hover:text-[#A03818] transition-colors cursor-pointer"
            >
              About
            </button>
          </nav>

        </div>
      </header>

      {/* ================= 2. HERO SECTION ================= */}
      {/* Balanced vertical padding */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Tag, Headline, Subtitle, Primary CTA */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Floating Community Noticeboard badge (smaller so it doesn't compete with headline) */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFDBD1] border border-[#A03818]/25 text-[#A03818]">
              <Sparkles className="w-3 h-3 text-[#A03818]" />
              <span className="text-[10.5px] font-['Epilogue'] font-black uppercase tracking-wider">
                Community Noticeboard
              </span>
            </div>

            {/* Headline & Subtitle with increased gap between them */}
            <div className="space-y-4 sm:space-y-5">
              {/* Headline with limited max-width for readable wrapping */}
              <h1 className="font-['Epilogue'] font-black text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] text-[#1F1B17] tracking-tight leading-[1.16] max-w-xl lg:max-w-2xl">
                “If you could change <span className="text-[#A03818] underline decoration-[#DEC0B8] decoration-wavy decoration-2">ONE thing</span> in your neighborhood, what would it be?”
              </h1>
              {/* Subtitle limited to 2 lines max */}
              <p className="font-sans text-sm sm:text-base text-[#57423C] leading-relaxed max-w-xl line-clamp-2">
                See broken streetlights, dangerous potholes, illegal garbage dumping, or leaking municipal lines? Snap a photo and post it to your ward board for student NSS volunteers to resolve with photo proof.
              </p>
            </div>

            {/* Slightly larger primary CTA button with subtle hover animation */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={handleGetStartedClick}
                className="touch-target min-h-[52px] sm:min-h-[56px] py-4 px-8 sm:px-9 rounded-xl font-['Epilogue'] font-black text-base cork-btn-primary flex items-center justify-center gap-3 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <Users className="w-5 h-5 stroke-[2.2]" />
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

          </div>

          {/* Right Column: Scaled down (15-20% smaller) and nudged slightly lower for balance */}
          <div className="lg:col-span-5 w-full max-w-sm sm:max-w-md mx-auto mt-4 lg:mt-6">
            <div className="relative bg-[#FFF8F5] border-2 border-[#DEC0B8] rounded-2xl p-4 sm:p-4.5 shadow-sm mt-3">
              
              {/* Top pushpins & washi tape */}
              <div className="absolute -top-2.5 left-6 z-20">
                <Pushpin color="rust" size="sm" />
              </div>
              <div className="absolute -top-2.5 right-6 z-20">
                <Pushpin color="teal" size="sm" />
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
                <WashiTape color="yellow" width="w-16" />
              </div>

              <div className="pt-1.5 pb-2 flex items-center justify-between border-b border-[#DEC0B8]/60 mb-3">
                <span className="font-['Caveat'] text-lg font-bold text-[#A03818]">
                  Ward Noticeboard Preview
                </span>
                <span className="text-[9.5px] font-['Epilogue'] font-extrabold uppercase tracking-wider text-[#6E5A4E] bg-[#FFDBD1]/70 px-2 py-0.5 rounded-full">
                  Real-time Bulletin
                </span>
              </div>

              {/* Dynamic or Real Top Active Card Preview */}
              {heroActive ? (
                <div
                  onClick={() => navigateTo('problem-wall')}
                  className="relative bg-[#FFFDF8] border-2 border-[#DEC0B8] rounded-xl p-3 shadow-xs -rotate-1 mb-2.5 cursor-pointer hover:rotate-0 hover:border-[#A03818] hover:-translate-y-0.5 transition-all duration-200 mt-2.5"
                >
                  <div className="absolute -top-2 right-4 z-20">
                    <Pushpin color="mustard" size="sm" />
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center gap-1 text-[9.5px] font-['Epilogue'] font-black uppercase text-[#7B5300] bg-[#FFDDAE]/70 px-1.5 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8A93A]" />
                      🟡 NSS Active
                    </span>
                    <span className="text-[10px] font-medium text-[#7C695E]">
                      {formatDateChip(heroActive.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-['Epilogue'] font-bold text-xs text-[#1F1B17] line-clamp-1">
                    {heroActive.title}
                  </h3>
                  <p className="text-[10.5px] text-[#6E5A4E] mt-0.5 line-clamp-1">
                    {heroActive.description}
                  </p>
                  <div className="mt-1.5 pt-1.5 border-t border-[#DEC0B8]/40 flex items-center justify-between text-[10px] text-[#57423C]">
                    <span className="flex items-center gap-1 font-medium truncate max-w-[160px]">
                      <MapPin className="w-3 h-3 text-[#A03818] shrink-0" />
                      {heroActive.location}
                    </span>
                    <span className="font-semibold text-[#A03818] shrink-0">
                      ▲ {heroActive.upvotes} upvotes
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  onClick={handleReportProblemClick}
                  className="relative bg-[#FFFDF8] border-2 border-dashed border-[#DEC0B8] rounded-xl p-3 mb-2.5 cursor-pointer hover:border-[#A03818] hover:-translate-y-0.5 transition-all duration-200 text-center space-y-1"
                >
                  <p className="font-['Epilogue'] font-bold text-xs text-[#1F1B17]">
                    No active issues right now
                  </p>
                  <p className="text-[10.5px] text-[#6E5A4E]">
                    Click here to voice the first neighborhood issue
                  </p>
                </div>
              )}

              {/* Dynamic or Real Top Solved Card Preview */}
              {heroSolved ? (
                <div
                  onClick={() => navigateTo('impact-gallery')}
                  className="relative bg-[#FFFDF8] border-2 border-[#B8EADE] rounded-xl p-3 shadow-xs rotate-1 cursor-pointer hover:rotate-0 hover:border-[#1B4B43] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="absolute -top-2 left-4">
                    <Pushpin color="teal" size="sm" />
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center gap-1 text-[9.5px] font-['Epilogue'] font-black uppercase text-[#1B4B43] bg-[#B8EADE]/80 px-1.5 py-0.5 rounded">
                      🟢 Solved Proof ✓
                    </span>
                    <span className="text-[10px] font-bold text-[#1B4B43]">
                      Closed
                    </span>
                  </div>
                  <h3 className="font-['Epilogue'] font-bold text-xs text-[#1F1B17] line-clamp-1">
                    {heroSolved.title}
                  </h3>
                  <div className="mt-1.5 pt-1.5 border-t border-[#DEC0B8]/40 flex items-center justify-between text-[10px] text-[#57423C]">
                    <span className="flex items-center gap-1 font-semibold text-[#1B4B43] truncate max-w-[170px]">
                      <Trophy className="w-3 h-3 shrink-0" />
                      {heroSolved.impactMetrics || 'Civic Resolution Complete'}
                    </span>
                    <span className="text-[#7C695E]">Verified</span>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => navigateTo('problem-wall')}
                  className="relative bg-[#FFFDF8] border-2 border-[#DEC0B8] rounded-xl p-3 shadow-xs rotate-1 cursor-pointer hover:rotate-0 hover:-translate-y-0.5 transition-all duration-200 text-center"
                >
                  <span className="text-xs font-['Epilogue'] font-bold text-[#1B4B43]">
                    Verified Before &amp; After Photo Proof Required
                  </span>
                  <p className="text-[10.5px] text-[#6E5A4E] mt-0.5">
                    NSS squads stamp every resolution with date &amp; coordinates
                  </p>
                </div>
              )}

              {/* Teaser browse button */}
              <button
                onClick={() => navigateTo('problem-wall')}
                className="touch-target min-h-[40px] w-full mt-2.5 py-2 px-3 rounded-xl text-xs font-['Epilogue'] font-bold text-[#A03818] bg-[#FAF6ED] border border-[#DEC0B8] hover:bg-[#FFDBD1]/30 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform"
              >
                <span>Click to browse full community board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* ================= 3. STATS SECTION (STAT-CARD TREATMENT WITH ICONS IN COLORED CIRCLES) ================= */}
      {/* Compact vertical padding */}
      <section className="w-full bg-[#FFF8F5] border-y-2 border-[#DEC0B8] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Stat Card 1: Problems Solved */}
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#DEC0B8]/60 shadow-xs flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 rounded-full bg-[#FFDBD1] flex items-center justify-center text-[#A03818] shrink-0">
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="font-['Epilogue'] font-black text-2xl sm:text-3xl text-[#A03818] tracking-tight leading-none">
                  {solvedCount}
                </div>
                <div className="font-['Epilogue'] font-bold text-xs uppercase tracking-wider text-[#1F1B17] mt-1">
                  Problems Solved
                </div>
                <p className="text-[11px] text-[#7C695E] mt-0.5 leading-snug">
                  Verified with Before &amp; After photo proof
                </p>
              </div>
            </div>

            {/* Stat Card 2: Active Volunteers */}
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#DEC0B8]/60 shadow-xs flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 rounded-full bg-[#FFDDAE] flex items-center justify-center text-[#7B5300] shrink-0">
                <Users className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="font-['Epilogue'] font-black text-2xl sm:text-3xl text-[#7B5300] tracking-tight leading-none">
                  {volunteerCount}
                </div>
                <div className="font-['Epilogue'] font-bold text-xs uppercase tracking-wider text-[#1F1B17] mt-1">
                  Active Volunteers
                </div>
                <p className="text-[11px] text-[#7C695E] mt-0.5 leading-snug">
                  NSS collegiate student volunteers
                </p>
              </div>
            </div>

            {/* Stat Card 3: Verified Reports */}
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#DEC0B8]/60 shadow-xs flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 rounded-full bg-[#B8EADE] flex items-center justify-center text-[#1B4B43] shrink-0">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="font-['Epilogue'] font-black text-2xl sm:text-3xl text-[#1B4B43] tracking-tight leading-none">
                  {verifiedPercentage}
                </div>
                <div className="font-['Epilogue'] font-bold text-xs uppercase tracking-wider text-[#1F1B17] mt-1">
                  Verified Reports
                </div>
                <p className="text-[11px] text-[#7C695E] mt-0.5 leading-snug">
                  Authentic neighborhood voices
                </p>
              </div>
            </div>

            {/* Stat Card 4: Average Response */}
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#DEC0B8]/60 shadow-xs flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 rounded-full bg-[#FAF6ED] border border-[#DEC0B8] flex items-center justify-center text-[#57423C] shrink-0">
                <Clock className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="font-['Epilogue'] font-black text-2xl sm:text-3xl text-[#1F1B17] tracking-tight leading-none">
                  {avgResponseText}
                </div>
                <div className="font-['Epilogue'] font-bold text-xs uppercase tracking-wider text-[#1F1B17] mt-1">
                  Average Response
                </div>
                <p className="text-[11px] text-[#7C695E] mt-0.5 leading-snug">
                  Squad triage by local NSS units
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 4. "HOW IT WORKS" SECTION (INFORMATIONAL: SOFT CREAM, BORDERLESS CARDS) ================= */}
      {/* Balanced vertical padding */}
      <section id="how-it-works" className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-8 sm:mb-10">
          <div className="inline-block relative">
            <span className="font-['Caveat'] text-2xl text-[#A03818] font-bold block -rotate-2">
              Simple 3-Step Civic Cycle
            </span>
          </div>
          <h2 className="font-['Epilogue'] font-black text-2xl sm:text-3xl lg:text-4xl text-[#1F1B17] tracking-tight">
            How NSS Voice Works
          </h2>
          <p className="text-xs sm:text-sm text-[#57423C] max-w-xl mx-auto leading-relaxed">
            Bridging the gap between concerned citizens and collegiate volunteer force to solve neighborhood issues transparently.
          </p>
        </div>

        {/* 3 Equal Columns - Informational: soft cream background, NO borders, lighter/flatter feel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* Step 1: Voice a Problem */}
          <div className="relative bg-[#FFF8F5] border-0 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div className="absolute -top-3 left-6">
              <Pushpin color="rust" size="md" />
            </div>

            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FFDBD1] flex items-center justify-center text-[#A03818] mb-4">
                <Camera className="w-6 h-6 stroke-[2.2]" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10.5px] font-mono font-bold text-[#A03818] uppercase tracking-wider block">
                  Step 01 • Citizen Action
                </span>
                <h3 className="font-['Epilogue'] font-black text-lg text-[#1F1B17]">
                  Voice a Problem
                </h3>
                <p className="text-xs sm:text-sm text-[#57423C] leading-relaxed">
                  Snap a quick photo of broken infrastructure on your street. Drop a pin on the map, describe the problem, and pin it to the board for your local NSS squad to review.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#DEC0B8]/40 flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1F1B17]">Resident Voice</span>
              <span className="text-[11px] font-bold text-[#A03818]">Takes 30 seconds</span>
            </div>
          </div>

          {/* Step 2: Volunteers Act */}
          <div className="relative bg-[#FFF8F5] border-0 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div className="absolute -top-3 left-6">
              <Pushpin color="mustard" size="md" />
            </div>

            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FFDDAE] flex items-center justify-center text-[#7B5300] mb-4">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10.5px] font-mono font-bold text-[#7B5300] uppercase tracking-wider block">
                  Step 02 • Cadet Mobilization
                </span>
                <h3 className="font-['Epilogue'] font-black text-lg text-[#1F1B17]">
                  Volunteers Act
                </h3>
                <p className="text-xs sm:text-sm text-[#57423C] leading-relaxed">
                  College NSS cadets review submitted notices, prioritize based on neighbor upvotes, coordinate with ward authorities, and organize weekend on-ground resolution drives.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#DEC0B8]/40 flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1F1B17]">Collegiate Cadre</span>
              <span className="text-[11px] font-bold text-[#7B5300]">Not Me But You</span>
            </div>
          </div>

          {/* Step 3: Before & After Proof */}
          <div className="relative bg-[#FFF8F5] border-0 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div className="absolute -top-3 left-6">
              <Pushpin color="teal" size="md" />
            </div>

            <div>
              <div className="w-12 h-12 rounded-xl bg-[#B8EADE] flex items-center justify-center text-[#1B4B43] mb-4">
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10.5px] font-mono font-bold text-[#1B4B43] uppercase tracking-wider block">
                  Step 03 • Public Verification
                </span>
                <h3 className="font-['Epilogue'] font-black text-lg text-[#1F1B17]">
                  Before &amp; After Proof
                </h3>
                <p className="text-xs sm:text-sm text-[#57423C] leading-relaxed">
                  Upon completion, volunteers upload dated photo proof of the fix. An authentic ink stamp marks the problem solved, giving the neighborhood a transparent record of impact.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#DEC0B8]/40 flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1F1B17]">Photo Evidence</span>
              <span className="text-[11px] font-bold text-[#1B4B43]">Stamped Solved</span>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 5. "SEE WHAT'S HAPPENING ON THE BOARD" SECTION (INTERACTIVE: KEEP BORDERS) ================= */}
      {/* Balanced vertical padding */}
      <section id="live-preview" className="w-full cork-pattern px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t-2 border-[#DEC0B8]">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Pushpin color="rust" size="sm" />
                <span className="text-xs font-['Epilogue'] font-black text-[#A03818] uppercase tracking-wider">
                  Live Public Bulletin
                </span>
              </div>
              <h2 className="font-['Epilogue'] font-black text-2xl sm:text-3xl lg:text-4xl text-[#1F1B17] tracking-tight mt-1">
                See What's Happening on the Board
              </h2>
              <p className="text-xs sm:text-sm text-[#57423C] mt-1 max-w-xl">
                Active, unsolved problems voiced by neighbors. Upvote priority issues or inspect current volunteer action.
              </p>
            </div>

            <button
              onClick={() => navigateTo('problem-wall')}
              className="touch-target min-h-[44px] self-start sm:self-auto py-2.5 px-4 rounded-xl text-xs font-['Epilogue'] font-extrabold text-[#A03818] bg-[#FFF8F5] border-2 border-[#DEC0B8] hover:bg-[#FFDBD1]/30 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <span>Browse All Problems</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Real Data Render or Genuine Empty State */}
          {activeProblems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-2">
              {activeProblems.slice(0, 4).map((problem, idx) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  rotation={idx % 2 === 0 ? -0.8 : 0.8}
                  showActions={true}
                />
              ))}
            </div>
          ) : (
            <div className="w-full bg-[#FFFDF8] border-2 border-dashed border-[#DEC0B8] rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FFDBD1] flex items-center justify-center text-[#A03818]">
                <MapPin className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-['Epilogue'] font-black text-lg text-[#1F1B17]">
                  No active reports yet
                </h3>
                <p className="text-xs sm:text-sm text-[#57423C]">
                  Be the first to post a neighborhood issue for our NSS cadets to resolve.
                </p>
              </div>
              <button
                onClick={handleReportProblemClick}
                className="touch-target inline-flex items-center gap-2 py-3 px-6 rounded-xl font-['Epilogue'] font-black text-xs sm:text-sm cork-btn-primary cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report a Problem</span>
              </button>
            </div>
          )}

          {/* Action button below cards */}
          {activeProblems.length > 0 && (
            <div className="text-center pt-2">
              <button
                onClick={() => navigateTo('problem-wall')}
                className="touch-target min-h-[48px] inline-flex items-center gap-2 py-3 px-6 rounded-xl font-['Epilogue'] font-black text-xs sm:text-sm cork-btn-primary cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <span>Explore All Pinned Issues</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ================= 6. RECENTLY SOLVED SECTION (INTERACTIVE: KEEP BORDERS, CLEAR BEFORE/AFTER BADGES & CONNECTING ARROW) ================= */}
      {/* Balanced vertical padding */}
      <section id="recently-solved" className="w-full bg-[#FFF8F5] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t-2 border-[#DEC0B8]">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#1B4B43]" />
                <span className="text-xs font-['Epilogue'] font-black text-[#1B4B43] uppercase tracking-wider">
                  Verified Proof
                </span>
              </div>
              <h2 className="font-['Epilogue'] font-black text-2xl sm:text-3xl lg:text-4xl text-[#1F1B17] tracking-tight mt-1">
                Recently Solved Showcase
              </h2>
              <p className="text-xs sm:text-sm text-[#57423C] mt-1 max-w-xl">
                Every resolution requires photographic before and after evidence before receiving its official stamp.
              </p>
            </div>

            <button
              onClick={() => navigateTo('impact-gallery')}
              className="touch-target min-h-[44px] self-start sm:self-auto py-2.5 px-4 rounded-xl text-xs font-['Epilogue'] font-extrabold text-[#1B4B43] bg-[#FAF6ED] border-2 border-[#B8EADE] hover:bg-[#B8EADE]/40 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <span>See All Solved Problems</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Real Data Render or Genuine Empty State */}
          {solvedProblems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              {solvedProblems.slice(0, 3).map((item, idx) => {
                const beforePhoto = item.beforePhotoUrl || item.photoUrl;
                const afterPhoto = item.solvedPhotoUrl || item.photoUrl;

                return (
                  <div
                    key={item.id}
                    onClick={() => navigateTo('impact-gallery')}
                    style={{ transform: `rotate(${(idx % 2 === 0 ? -0.5 : 0.5)}deg)` }}
                    className="relative bg-[#FFFDF8] border-2 border-[#DEC0B8] rounded-2xl p-4 sm:p-4.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:rotate-0 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
                  >
                    {/* Pushpin at top */}
                    <div className="absolute -top-3 right-6">
                      <Pushpin color="teal" size="sm" />
                    </div>

                    <div>
                      {/* Rubber stamp + Impact tag */}
                      <div className="flex items-center justify-between gap-2 mb-2 pt-1">
                        <RubberStamp status="SOLVED" size="sm" />
                        <span className="text-[10px] font-['Epilogue'] font-extrabold text-[#1B4B43] bg-[#B8EADE]/70 px-2 py-0.5 rounded-full truncate max-w-[150px]">
                          {item.impactMetrics || 'Civic Fix Verified'}
                        </span>
                      </div>

                      <h3 className="font-['Epilogue'] font-black text-sm sm:text-base text-[#1F1B17] leading-tight line-clamp-1 group-hover:text-[#A03818] transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs text-[#6E5A4E] mt-1 line-clamp-2 leading-snug">
                        {item.description}
                      </p>

                      {/* Side-by-side Before & After Photos with clear BADGES and CONNECTING ARROW */}
                      <div className="relative mt-3 pt-2.5 border-t border-[#DEC0B8]/50">
                        <div className="grid grid-cols-2 gap-2 relative">
                          {/* Before Photo with Red Badge */}
                          <div className="space-y-1">
                            <span className="inline-block bg-[#A03818] text-white px-2 py-0.5 rounded text-[9.5px] font-['Epilogue'] font-black uppercase tracking-wider">
                              BEFORE
                            </span>
                            <div className="h-28 rounded-lg overflow-hidden border border-[#DEC0B8] bg-[#FAF6ED]">
                              {beforePhoto ? (
                                <img
                                  src={beforePhoto}
                                  alt="Before civic hazard"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[11px] text-[#8C7A70]">
                                  Before Photo
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Connecting Arrow Graphic between the two photos */}
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[#FFFDF8] border-2 border-[#1B4B43] text-[#1B4B43] flex items-center justify-center shadow-xs">
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>

                          {/* After Photo with Green Badge */}
                          <div className="space-y-1">
                            <span className="inline-block bg-[#1B4B43] text-white px-2 py-0.5 rounded text-[9.5px] font-['Epilogue'] font-black uppercase tracking-wider">
                              AFTER
                            </span>
                            <div className="h-28 rounded-lg overflow-hidden border border-[#B8EADE] bg-[#FAF6ED]">
                              {afterPhoto ? (
                                <img
                                  src={afterPhoto}
                                  alt="After verified fix"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[11px] text-[#8C7A70]">
                                  After Photo
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#DEC0B8]/40 flex items-center justify-between text-[11px] text-[#57423C]">
                      <span className="flex items-center gap-1 font-medium truncate max-w-[170px]">
                        <MapPin className="w-3 h-3 text-[#A03818] shrink-0" />
                        {item.location}
                      </span>
                      <span className="font-bold text-[#1B4B43] shrink-0">
                        {item.assignedSquad || 'NSS Volunteer Unit'}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full bg-[#FFFDF8] border-2 border-dashed border-[#DEC0B8] rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#B8EADE] flex items-center justify-center text-[#1B4B43]">
                <Trophy className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-['Epilogue'] font-black text-lg text-[#1F1B17]">
                  No solved problems yet
                </h3>
                <p className="text-xs sm:text-sm text-[#57423C]">
                  Check back soon — our NSS squads are actively working on reported community notices.
                </p>
              </div>
            </div>
          )}

          {solvedProblems.length > 0 && (
            <div className="text-center pt-2">
              <button
                onClick={() => navigateTo('impact-gallery')}
                className="touch-target min-h-[48px] inline-flex items-center gap-2 py-3 px-6 rounded-xl font-['Epilogue'] font-black text-xs sm:text-sm cork-btn-teal cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <span>Explore Full Impact Gallery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ================= 7. FOOTER ================= */}
      <footer className="w-full bg-[#FFFDF8] border-t-2 border-[#DEC0B8] py-10 sm:py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Col: Brand, NSS Seal, College Unit Badge & Motto */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full p-0.5 bg-[#FFFDF8] border-2 border-[#A03818] shadow-xs shrink-0">
                  <img
                    src={NSS_SEAL_URL}
                    alt="National Service Scheme Seal"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <span className="font-['Epilogue'] font-black text-base sm:text-lg text-[#1F1B17] block">
                    National Service Scheme
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#7C695E]">
                    <GraduationCap className="w-3.5 h-3.5 text-[#A03818]" />
                    <span>CMRIT NSS Unit 1 (Hyderabad)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#57423C] leading-relaxed max-w-sm">
                A collaborative civic platform where neighbors anonymously voice localized infrastructure issues and collegiate NSS student volunteers mobilize to resolve them with verified photographic evidence.
              </p>

              {/* Motto Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF6ED] border border-[#DEC0B8] text-xs text-[#57423C]">
                <HeartHandshake className="w-3.5 h-3.5 text-[#A03818]" />
                <span className="font-semibold text-[#1F1B17]">NSS Motto:</span>
                <span className="font-mono text-[11px] text-[#A03818] font-bold">NOT ME BUT YOU</span>
              </div>

              {/* Contact Email & Social Link */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs text-[#57423C]">
                <a
                  href="mailto:coordinator@nss.org"
                  className="inline-flex items-center gap-1.5 hover:text-[#A03818] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#A03818]" />
                  <span>coordinator@nss.org</span>
                </a>
                <a
                  href="https://www.instagram.com/cmrit.nss?stkn=MWN4dnNpYTlwMDBxZA=="
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[#A03818] transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#A03818]" />
                  <span>@cmrit.nss</span>
                </a>
              </div>
            </div>

            {/* Center Col: Portals & Roles with distinct role accent colors */}
            <div className="md:col-span-4 space-y-3">
              <span className="text-xs font-['Epilogue'] font-black uppercase tracking-wider text-[#1F1B17] block">
                User Portals &amp; Views
              </span>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={handleGetStartedClick}
                    className="touch-target py-1 text-[#A03818] font-bold hover:underline cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A03818]" />
                    <span>Resident Portal (Report a Problem)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('problem-wall')}
                    className="touch-target py-1 text-[#57423C] hover:text-[#A03818] hover:underline cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DEC0B8]" />
                    <span>Browse Community Noticeboard</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('impact-gallery')}
                    className="touch-target py-1 text-[#57423C] hover:text-[#A03818] hover:underline cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DEC0B8]" />
                    <span>Neighborhood Wins (Before &amp; After Proof)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleVolunteerClick}
                    className="touch-target py-1 text-[#1B4B43] font-bold hover:underline cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43]" />
                    <span>Volunteer Cadet Sign In</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleAdminClick}
                    className="touch-target py-1 text-[#7B5300] font-bold hover:underline cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7B5300]" />
                    <span>Programme Officer &amp; Coordinator Portal</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Right Col: Trust & Transparency */}
            <div className="md:col-span-3 space-y-3">
              <span className="text-xs font-['Epilogue'] font-black uppercase tracking-wider text-[#1F1B17] block">
                Trust &amp; Transparency
              </span>
              <ul className="space-y-2 text-xs text-[#57423C]">
                <li>
                  <button
                    onClick={() => navigateTo('about')}
                    className="touch-target py-1 hover:text-[#A03818] hover:underline cursor-pointer"
                  >
                    About NSS Community Corkboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('about')}
                    className="touch-target py-1 hover:text-[#A03818] hover:underline cursor-pointer"
                  >
                    Civic Trust &amp; Anti-Spam Safety
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('about')}
                    className="touch-target py-1 hover:text-[#A03818] hover:underline cursor-pointer"
                  >
                    Privacy Commitment (Zero Tracking)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('about')}
                    className="touch-target py-1 hover:text-[#A03818] hover:underline cursor-pointer"
                  >
                    Contact Ward Coordinator
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Strip with Tagline */}
          <div className="pt-6 border-t border-[#DEC0B8]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7C695E]">
            <p className="font-medium">
              Made with ❤️ by NSS volunteers • Ministry of Youth Affairs and Sports
            </p>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="font-mono">CMRIT Hyderabad Unit</span>
              <span>•</span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="touch-target min-h-[38px] px-2 hover:text-[#1F1B17] cursor-pointer font-bold transition-colors"
              >
                Back to Top ↑
              </button>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
