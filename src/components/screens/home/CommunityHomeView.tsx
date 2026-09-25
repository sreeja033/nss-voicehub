import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ProblemCard } from '../../common/ProblemCard';
import { Pushpin } from '../../common/Pushpin';
import { WashiTape } from '../../common/WashiTape';
import { RubberStamp } from '../../common/RubberStamp';
import {
  PlusCircle,
  ArrowRight,
  Trash2,
  Lightbulb,
  Cone,
  Droplets,
  Trees,
  GraduationCap,
  Accessibility,
  MapPin,
  Pencil,
  Check,
  X,
  Sparkles,
  Inbox,
  ShieldCheck,
  Award,
  Camera,
  CheckCircle2,
  Clock,
  HeartHandshake,
} from 'lucide-react';
import { ProblemCategory } from '../../../types';

export const CommunityHomeView: React.FC = () => {
  const {
    problems,
    myReportedProblemIds,
    navigateTo,
    setFilterCategory,
    isCommunityLoggedIn,
    currentCommunityMember,
    updateCommunityLocation,
    provisionedVolunteers,
    volunteerRoster,
  } = useApp();

  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [editedLocation, setEditedLocation] = useState('');
  const [showOnlyMyReports, setShowOnlyMyReports] = useState(false);

  const volunteerCount = provisionedVolunteers?.length ?? volunteerRoster?.length ?? 0;

  const approvedProblems = problems.filter((p) => {
    if (p.status === 'PENDING_REVIEW' || p.moderationStatus === 'PENDING' || !p.isApproved) return false;
    if (p.moderationStatus === 'REJECTED' || p.status === 'REJECTED') return false;
    return true;
  });
  const reportedAndInProgress = approvedProblems.filter((p) => p.status !== 'SOLVED');
  const solvedProblems = problems.filter((p) => p.status === 'SOLVED');

  // Reports authored by the currently logged-in user or posted during this session
  const myReports = problems.filter((p) => {
    if (myReportedProblemIds && myReportedProblemIds.includes(p.id)) return true;
    if (!currentCommunityMember?.id) return false;
    return (
      p.reportedByUserId === currentCommunityMember.id ||
      (currentCommunityMember.fullName &&
        p.reportedByAuthor &&
        p.reportedByAuthor.toLowerCase() === currentCommunityMember.fullName.toLowerCase())
    );
  });

  const categories: { label: ProblemCategory; icon: React.ReactNode; color: string }[] = [
    { label: 'Garbage', icon: <Trash2 className="w-5 h-5 text-[#A03818]" />, color: '#FFDBD1' },
    { label: 'Streetlights', icon: <Lightbulb className="w-5 h-5 text-[#842504]" />, color: '#FFDDAE' },
    { label: 'Roads', icon: <Cone className="w-5 h-5 text-[#A03818]" />, color: '#FFDDAE' },
    { label: 'Water', icon: <Droplets className="w-5 h-5 text-[#A03818]" />, color: '#FFE6D8' },
    { label: 'Greenery', icon: <Trees className="w-5 h-5 text-[#842504]" />, color: '#FFEEDD' },
    { label: 'School', icon: <GraduationCap className="w-5 h-5 text-[#842504]" />, color: '#FFDBD1' },
    { label: 'Accessibility', icon: <Accessibility className="w-5 h-5 text-[#A03818]" />, color: '#FCF2EB' },
  ];

  const handleCategoryClick = (cat: string) => {
    setFilterCategory(cat);
    navigateTo('problem-wall');
  };

  const handleSaveLocation = async () => {
    const clean = editedLocation.trim();
    if (!clean) return;
    await updateCommunityLocation(clean);
    setIsEditingLocation(false);
  };

  return (
    <div className="space-y-6 w-full max-w-full pt-1">
      
      {/* ================= 1. WIDE HERO BANNER WITH EMBEDDED COMMUNITY STATS ================= */}
      <div className="relative bg-[#FFFDF8] border-2 border-[#DEC0B8] rounded-2xl p-5 sm:p-7 lg:p-8 shadow-[0_4px_16px_rgba(43,38,34,0.08)] mt-3.5">
        {/* Decorative pins and washi tape */}
        <div className="absolute -top-2.5 left-10 z-20">
          <Pushpin color="rust" size="md" />
        </div>
        <div className="absolute -top-2.5 right-10 z-20">
          <Pushpin color="teal" size="md" />
        </div>
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
          <WashiTape color="yellow" width="w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center pt-2">
          
          {/* Hero Left / Question & Pitch */}
          <div className="lg:col-span-7 space-y-3.5 text-left">
            <div className="flex items-center gap-2">
              <span className="font-['Caveat'] text-2xl text-[#A03818] font-bold block -rotate-2">
                Neighborhood Noticeboard
              </span>
              <span className="text-[11px] font-mono font-bold text-[#A03818] bg-[#FFDBD1]/70 px-2 py-0.5 rounded-full border border-[#A03818]/20">
                Live Community Desk
              </span>
            </div>

            <h1 className="font-['Epilogue'] font-black text-2xl sm:text-3xl lg:text-4xl text-[#1F1B17] tracking-tight leading-snug">
              “If you could change ONE thing in your neighborhood, what would it be?”
            </h1>

            <p className="text-xs sm:text-sm text-[#57423C] leading-relaxed max-w-xl">
              See a broken street lamp, uncovered manhole, or garbage pile? Post it here anonymously. NSS student cadets claim neighborhood notices, organize cleanup drives, and post verified photo proof.
            </p>

            {/* Resident location / quick status info */}
            {isCommunityLoggedIn ? (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FAF6ED] border border-[#DEC0B8] text-xs">
                  <span className="text-base">{currentCommunityMember?.avatar || '🏡'}</span>
                  <span className="font-['Epilogue'] font-bold text-[#1F1B17]">
                    {currentCommunityMember?.fullName}
                  </span>
                  <span className="text-[#8C7A70]">•</span>
                  {isEditingLocation ? (
                    <div className="inline-flex items-center gap-1">
                      <input
                        type="text"
                        value={editedLocation}
                        onChange={(e) => setEditedLocation(e.target.value)}
                        placeholder="Enter ward..."
                        className="text-xs px-1.5 py-0.5 border border-[#DEC0B8] rounded bg-white"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveLocation}
                        className="p-1 bg-[#A03818] text-white rounded cursor-pointer"
                        title="Save"
                      >
                        <Check className="w-2.5 h-2.5" />
                      </button>
                      <button
                        onClick={() => setIsEditingLocation(false)}
                        className="p-1 bg-gray-200 text-[#1F1B17] rounded cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[#57423C]">
                      <MapPin className="w-3 h-3 text-[#A03818]" />
                      <span className="font-medium text-[#1F1B17]">
                        {currentCommunityMember?.location || currentCommunityMember?.ward || 'Ward Central'}
                      </span>
                      <button
                        onClick={() => {
                          setEditedLocation(currentCommunityMember?.location || currentCommunityMember?.ward || '');
                          setIsEditingLocation(true);
                        }}
                        className="text-[10px] text-[#A03818] hover:underline font-bold ml-1 cursor-pointer"
                      >
                        Edit
                      </button>
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-[#6E5A4E] pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Posting is completely anonymous — no account required to report.</span>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => {
                  if (isCommunityLoggedIn) {
                    navigateTo('report-problem');
                  } else {
                    navigateTo('community-login');
                  }
                }}
                className="py-3 px-5 rounded-xl font-['Epilogue'] font-black text-xs sm:text-sm cork-btn-primary flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                <PlusCircle className="w-4.5 h-4.5 stroke-[2.5]" />
                <span>Voice a Problem</span>
              </button>

              <button
                onClick={() => navigateTo('problem-wall')}
                className="py-3 px-4 rounded-xl font-['Epilogue'] font-bold text-xs sm:text-sm bg-[#FFF8F5] border border-[#DEC0B8] text-[#57423C] hover:bg-[#FAF0E1] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Browse All Notices ({reportedAndInProgress.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hero Right / Built-In Community Stats Card */}
          <div className="lg:col-span-5 bg-[#FFF8F5] border-2 border-[#DEC0B8] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-[#DEC0B8]/60 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-[#A03818]" />
                <span className="font-['Epilogue'] font-extrabold text-xs text-[#1F1B17] uppercase tracking-wider">
                  Ward Action Pulse
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#1B4B43] bg-[#B8EADE]/60 px-2 py-0.5 rounded-full">
                Active Cadre
              </span>
            </div>

            {/* 3 Display Stat Columns */}
            <div className="grid grid-cols-3 divide-x divide-[#DEC0B8]">
              <div className="text-center px-1">
                <div className="font-['Epilogue'] font-black text-2xl lg:text-3xl text-[#A03818] tracking-tight">
                  {solvedProblems.length}
                </div>
                <div className="text-[10px] font-['Epilogue'] font-extrabold uppercase tracking-wider text-[#6E5A4E] mt-0.5">
                  Solved
                </div>
                <div className="text-[9px] text-[#8C7A70]">Photo Verified</div>
              </div>

              <div className="text-center px-1">
                <div className="font-['Epilogue'] font-black text-2xl lg:text-3xl text-[#7B5300] tracking-tight">
                  {volunteerCount}
                </div>
                <div className="text-[10px] font-['Epilogue'] font-extrabold uppercase tracking-wider text-[#6E5A4E] mt-0.5">
                  Volunteers
                </div>
                <div className="text-[9px] text-[#8C7A70]">Ready on Duty</div>
              </div>

              <div className="text-center px-1">
                <div className="font-['Epilogue'] font-black text-2xl lg:text-3xl text-[#1B4B43] tracking-tight">
                  100%
                </div>
                <div className="text-[10px] font-['Epilogue'] font-extrabold uppercase tracking-wider text-[#6E5A4E] mt-0.5">
                  Private
                </div>
                <div className="text-[9px] text-[#8C7A70]">Anonymous Posts</div>
              </div>
            </div>

            {/* Trust Motto */}
            <div className="pt-2 border-t border-[#DEC0B8]/60 flex items-center justify-between text-[11px] text-[#6E5A4E]">
              <span className="flex items-center gap-1 font-semibold text-[#1F1B17]">
                <HeartHandshake className="w-3.5 h-3.5 text-[#A03818]" />
                National Service Scheme
              </span>
              <span className="font-mono text-[10px] text-[#8C7A70]">Not Me But You</span>
            </div>
          </div>

        </div>
      </div>

      {/* ================= 2. DASHBOARD ROW (3 SIDE-BY-SIDE COLUMNS) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch w-full">
        
        {/* COLUMN 1: RECENT REPORTS NEAR YOU */}
        <div className="relative bg-[#FFFDF8] border-2 border-[#DEC0B8] rounded-xl p-4 sm:p-5 shadow-[0_4px_12px_rgba(43,38,34,0.06)] flex flex-col justify-between">
          <div className="absolute -top-2.5 left-5">
            <Pushpin color="rust" size="sm" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3 pt-0.5">
              <h2 className="font-['Epilogue'] font-black text-sm text-[#1F1B17] tracking-tight">
                Recent Reports Near You
              </h2>
              <button
                onClick={() => navigateTo('problem-wall')}
                className="text-[11px] font-['Epilogue'] font-bold text-[#A03818] hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {reportedAndInProgress.length === 0 ? (
              <div className="bg-[#FAF6ED] border border-dashed border-[#DEC0B8] rounded-xl p-4 text-center space-y-2">
                <span className="text-2xl">🌱</span>
                <h3 className="font-['Epilogue'] font-bold text-xs text-[#1F1B17]">
                  Noticeboard is Clear
                </h3>
                <p className="text-[11px] text-[#6E5A4E] leading-snug">
                  No open issues currently reported in this ward. If you spot a broken light, pothole, or garbage pile, be the first to post.
                </p>
                <button
                  onClick={() => navigateTo('report-problem')}
                  className="mt-1 py-1.5 px-3 rounded-lg text-xs font-['Epilogue'] font-bold bg-[#A03818] text-white hover:bg-[#842504] cursor-pointer inline-flex items-center gap-1 shadow-xs"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>Report Problem</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {reportedAndInProgress.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigateTo('problem-detail', item.id)}
                    className="p-2.5 rounded-lg bg-[#FAF6ED] hover:bg-[#FFF5F0] border border-[#DEC0B8]/60 transition-colors cursor-pointer text-left space-y-1"
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-[10px] font-['Epilogue'] font-extrabold uppercase px-1.5 py-0.2 rounded bg-[#FFDBD1] text-[#A03818]">
                        {item.category}
                      </span>
                      <span className="text-[9.5px] font-mono text-[#8C7A70]">
                        {item.status === 'IN_PROGRESS' ? 'Cadet Assigned' : 'Reported'}
                      </span>
                    </div>
                    <h3 className="font-['Epilogue'] font-bold text-xs text-[#1F1B17] line-clamp-1">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] text-[#6E5A4E] pt-0.5">
                      <span className="flex items-center gap-0.5 truncate max-w-[160px]">
                        <MapPin className="w-2.5 h-2.5 text-[#A03818] shrink-0" />
                        {item.locationName || 'Ward Area'}
                      </span>
                      <span className="font-semibold text-[#A03818]">
                        ▲ {item.upvotes || 0} votes
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-[#DEC0B8]/40">
            <span className="text-[10.5px] text-[#8C7A70] block">
              {reportedAndInProgress.length} active civic issues under monitoring
            </span>
          </div>
        </div>

        {/* COLUMN 2: YOUR ACTIVITY */}
        <div className="relative bg-[#FFFDF8] border-2 border-[#DEC0B8] rounded-xl p-4 sm:p-5 shadow-[0_4px_12px_rgba(43,38,34,0.06)] flex flex-col justify-between">
          <div className="absolute -top-2.5 left-5">
            <Pushpin color="mustard" size="sm" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3 pt-0.5">
              <h2 className="font-['Epilogue'] font-black text-sm text-[#1F1B17] tracking-tight">
                Your Activity
              </h2>
              {isCommunityLoggedIn && (
                <span className="text-[10px] font-mono font-bold text-[#A03818] bg-[#FFDBD1]/70 px-2 py-0.5 rounded-full">
                  Resident Account
                </span>
              )}
            </div>

            {isCommunityLoggedIn ? (
              <div className="space-y-3">
                <div className="p-3 bg-[#FFF8F5] border border-[#DEC0B8] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#57423C]">Voiced by You:</span>
                    <span className="font-['Epilogue'] font-black text-sm text-[#A03818]">
                      {myReports.length} {myReports.length === 1 ? 'Notice' : 'Notices'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#6E5A4E]">
                    <span>In Field Progress:</span>
                    <span className="font-mono font-bold text-[#7B5300]">
                      {myReports.filter((p) => p.status === 'IN_PROGRESS').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#6E5A4E]">
                    <span>Resolved &amp; Stamped:</span>
                    <span className="font-mono font-bold text-[#1B4B43]">
                      {myReports.filter((p) => p.status === 'SOLVED').length}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {myReports.length > 0 ? (
                    <button
                      onClick={() => navigateTo('problem-wall')}
                      className="w-full py-2 px-3 rounded-lg text-xs font-['Epilogue'] font-bold text-[#A03818] bg-[#FAF6ED] border border-[#DEC0B8] hover:bg-[#FFDBD1]/30 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Inbox className="w-3.5 h-3.5" />
                      <span>Review Your {myReports.length} Voiced Issues</span>
                    </button>
                  ) : (
                    <p className="text-[11px] text-[#6E5A4E] text-center leading-snug">
                      You haven't posted any issues yet. When you report something, track its progress here.
                    </p>
                  )}

                  <button
                    onClick={() => navigateTo('report-problem')}
                    className="w-full py-2 px-3 rounded-lg text-xs font-['Epilogue'] font-bold bg-[#A03818] text-white hover:bg-[#842504] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Voice New Problem</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#FAF6ED] border border-[#DEC0B8] rounded-xl p-4 text-center space-y-2.5">
                <div className="w-9 h-9 rounded-full bg-[#FFDBD1]/70 border border-[#A03818]/30 mx-auto flex items-center justify-center text-lg">
                  🏡
                </div>
                <h3 className="font-['Epilogue'] font-bold text-xs text-[#1F1B17]">
                  Anonymous Resident Mode
                </h3>
                <p className="text-[11px] text-[#6E5A4E] leading-relaxed">
                  You can post reports freely without logging in. Sign in or register to track your submitted issues in one spot.
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={() => navigateTo('community-login')}
                    className="py-1.5 px-3 rounded-lg text-xs font-['Epilogue'] font-bold bg-[#A03818] text-white hover:bg-[#842504] cursor-pointer shadow-xs"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigateTo('community-register')}
                    className="py-1.5 px-3 rounded-lg text-xs font-['Epilogue'] font-bold bg-white border border-[#DEC0B8] text-[#57423C] hover:bg-[#FFF5F2] cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-[#DEC0B8]/40">
            <span className="text-[10.5px] text-[#8C7A70] block">
              100% anonymous &amp; secure civic tracking
            </span>
          </div>
        </div>

        {/* COLUMN 3: THIS MONTH'S PROGRESS & IMPACT */}
        <div className="relative bg-[#FFFDF8] border-2 border-[#DEC0B8] rounded-xl p-4 sm:p-5 shadow-[0_4px_12px_rgba(43,38,34,0.06)] flex flex-col justify-between">
          <div className="absolute -top-2.5 left-5">
            <Pushpin color="teal" size="sm" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3 pt-0.5">
              <h2 className="font-['Epilogue'] font-black text-sm text-[#1F1B17] tracking-tight">
                This Month's Progress
              </h2>
              <button
                onClick={() => navigateTo('impact-gallery')}
                className="text-[11px] font-['Epilogue'] font-bold text-[#A03818] hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>Impact Hub</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Solved spotlight or monthly summary */}
            {solvedProblems.length > 0 ? (
              <div className="space-y-3">
                <div className="p-3 bg-[#FAF6ED] border border-[#B8EADE] rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <RubberStamp status="SOLVED" size="sm" />
                    <span className="text-[10px] font-semibold text-[#1B4B43]">
                      Latest Resolution
                    </span>
                  </div>
                  <h3 className="font-['Epilogue'] font-bold text-xs text-[#1F1B17] line-clamp-1">
                    {solvedProblems[0].title}
                  </h3>
                  <p className="text-[11px] text-[#6E5A4E] line-clamp-2 leading-snug">
                    {solvedProblems[0].description}
                  </p>
                  {(solvedProblems[0].beforePhotoUrl || solvedProblems[0].photoUrl) && solvedProblems[0].solvedPhotoUrl && (
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <div className="h-16 rounded overflow-hidden border border-[#DEC0B8]">
                        <img
                          src={solvedProblems[0].beforePhotoUrl || solvedProblems[0].photoUrl}
                          alt="Before"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="h-16 rounded overflow-hidden border border-[#DEC0B8]">
                        <img
                          src={solvedProblems[0].solvedPhotoUrl}
                          alt="After"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigateTo('impact-gallery')}
                  className="w-full py-2 px-3 rounded-lg text-xs font-['Epilogue'] font-bold text-[#1B4B43] bg-[#B8EADE]/40 border border-[#B8EADE] hover:bg-[#B8EADE]/60 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>View All {solvedProblems.length} Solved Before &amp; Afters</span>
                </button>
              </div>
            ) : (
              <div className="bg-[#FAF6ED] border border-[#DEC0B8] rounded-xl p-4 text-center space-y-2">
                <Award className="w-8 h-8 text-[#A03818] mx-auto opacity-70" />
                <h3 className="font-['Epilogue'] font-bold text-xs text-[#1F1B17]">
                  Monthly Civic Drives Active
                </h3>
                <p className="text-[11px] text-[#6E5A4E] leading-relaxed">
                  NSS cadet squads conduct weekly field surveys and sanitation drives across all wards.
                </p>
                <div className="p-2 rounded bg-white border border-[#DEC0B8]/60 text-[10.5px] text-[#57423C]">
                  <span>Cadet Units active in Ward Central and East Zone</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-[#DEC0B8]/40">
            <span className="text-[10.5px] text-[#8C7A70] block">
              Powered by National Service Scheme (NSS)
            </span>
          </div>
        </div>

      </div>

      {/* ================= 3. BROWSE BY CATEGORY (FULL-WIDTH MULTI-COLUMN GRID) ================= */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A03818]" />
            <h2 className="font-['Epilogue'] font-black text-base text-[#1F1B17] tracking-tight">
              Browse by Civic Category
            </h2>
          </div>
          <button
            onClick={() => {
              setFilterCategory('All');
              navigateTo('problem-wall');
            }}
            className="text-xs font-['Epilogue'] font-bold text-[#A03818] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>See All Problems</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Full-width responsive multi-column grid across 7 categories */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 w-full">
          {categories.map((cat) => {
            const count = problems.filter((p) => p.category === cat.label).length;
            return (
              <button
                key={cat.label}
                onClick={() => handleCategoryClick(cat.label)}
                className="p-3.5 rounded-xl bg-[#FFFDF8] border-2 border-[#DEC0B8] shadow-xs hover:border-[#A03818] hover:shadow-md active:translate-y-0.5 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[#1F1B17] transition-transform group-hover:scale-105"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.icon}
                </div>
                <div>
                  <span className="text-xs font-['Epilogue'] font-extrabold text-[#1F1B17] block leading-tight">
                    {cat.label}
                  </span>
                  <span className="text-[10px] font-mono text-[#8C7A70] mt-0.5 block">
                    {count} {count === 1 ? 'Notice' : 'Notices'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 4. RECENT PROBLEMS CORKBOARD GRID ================= */}
      {reportedAndInProgress.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pushpin color="rust" size="sm" />
              <h2 className="font-['Epilogue'] font-black text-base text-[#1F1B17] tracking-tight">
                Active Ward Notices on the Corkboard
              </h2>
            </div>
            <button
              onClick={() => navigateTo('problem-wall')}
              className="text-xs font-['Epilogue'] font-bold text-[#A03818] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View All ({reportedAndInProgress.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
            {reportedAndInProgress.slice(0, 4).map((problem, idx) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                rotation={idx % 2 === 0 ? -0.8 : 0.8}
              />
            ))}
          </div>
        </div>
      )}

      {/* ================= 5. SOLVED WINS HIGHLIGHTS ================= */}
      {solvedProblems.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#B8EADE] text-[#1B4B43] flex items-center justify-center text-xs font-bold">
                ✓
              </div>
              <h2 className="font-['Epilogue'] font-black text-base text-[#1F1B17] tracking-tight">
                Recently Resolved by NSS Volunteers
              </h2>
            </div>
            <button
              onClick={() => navigateTo('impact-gallery')}
              className="text-xs font-['Epilogue'] font-bold text-[#A03818] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View All Wins</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {solvedProblems.slice(0, 3).map((solved) => (
              <div
                key={solved.id}
                onClick={() => navigateTo('problem-detail', solved.id)}
                className="relative bg-[#FFFDF8] border-2 border-[#DEC0B8] rounded-xl p-4 shadow-[0_4px_14px_rgba(43,38,34,0.07)] hover:shadow-md transition-all cursor-pointer -rotate-0.5"
              >
                <div className="absolute -top-3 right-6">
                  <Pushpin color="rust" size="md" />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <RubberStamp status="SOLVED" size="sm" />
                  <span className="text-xs font-['Epilogue'] font-extrabold text-[#1B4B43] bg-[#B8EADE]/60 px-2 py-0.5 rounded-full">
                    {solved.impactMetrics || 'Fixed'}
                  </span>
                </div>

                <h3 className="font-['Epilogue'] font-bold text-sm text-[#1F1B17]">
                  {solved.title}
                </h3>

                <p className="text-xs text-[#6E5A4E] mt-1 line-clamp-2">
                  {solved.description}
                </p>

                {(solved.beforePhotoUrl || solved.photoUrl) && solved.solvedPhotoUrl && (
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-[#DEC0B8]/50">
                    <div className="space-y-1">
                      <div className="text-[10px] font-['Epilogue'] font-extrabold text-[#A03818] uppercase tracking-wider">
                        Before
                      </div>
                      <div className="h-24 rounded-lg overflow-hidden border border-[#DEC0B8] bg-[#FAF6ED]">
                        <img
                          src={solved.beforePhotoUrl || solved.photoUrl}
                          alt="Before"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-['Epilogue'] font-extrabold text-[#1B4B43] uppercase tracking-wider">
                        After (Fixed ✓)
                      </div>
                      <div className="h-24 rounded-lg overflow-hidden border border-[#DEC0B8] bg-[#FAF6ED]">
                        <img
                          src={solved.solvedPhotoUrl}
                          alt="After"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 6. COMMUNITY ASSURANCE FOOTER PIN ================= */}
      <div className="bg-[#FFF8F5] border border-[#DEC0B8] rounded-xl p-4 text-center text-xs text-[#6E5A4E] space-y-1">
        <div className="font-['Epilogue'] font-bold text-[#1F1B17] text-sm flex items-center justify-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-[#A03818]" />
          <span>National Service Scheme • Neighborhood Civic Cadre</span>
        </div>
        <p>
          All citizen posts are submitted anonymously without personal tracking. NSS student volunteers review noticeboards and coordinate with local civic squads weekly.
        </p>
      </div>

    </div>
  );
};
