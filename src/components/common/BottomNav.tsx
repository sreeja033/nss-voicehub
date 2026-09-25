import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Trophy,
  Info,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  UserCheck,
  Users,
  Send,
  ShieldAlert,
} from 'lucide-react';
import { Pushpin } from './Pushpin';
import { AdminTab } from '../../types';

export const BottomNav: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    userRole,
    isAdminLoggedIn,
    isCommunityLoggedIn,
    adminTab,
    setAdminTab,
    problems,
  } = useApp();

  // Hide bottom nav entirely on welcome, role-split, volunteer-signin, or unauthenticated admin login
  if (
    currentScreen === 'welcome' ||
    currentScreen === 'role-split' ||
    currentScreen === 'volunteer-signin' ||
    (currentScreen === 'admin' && !isAdminLoggedIn)
  ) {
    return null;
  }

  // Strictly identify admin mode: on admin screen, logged in as admin, or userRole is admin
  const isAdmin = userRole === 'admin' || currentScreen === 'admin' || isAdminLoggedIn;
  const isVolunteer = !isAdmin && userRole === 'volunteer';

  const unassignedTasksCount = problems.filter(
    (p) => p.status === 'REPORTED' && !p.assignedLead
  ).length;

  const handleAdminNav = (tab: AdminTab) => {
    setAdminTab(tab);
    if (currentScreen !== 'admin') {
      navigateTo('admin');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 1. MOBILE BOTTOM BAR (Screens below 768px: untouched mobile experience; hidden during full-screen report form on mobile) */}
      <div className={`md:hidden ${currentScreen === 'report-problem' ? 'hidden' : 'fixed'} bottom-0 left-0 right-0 z-40 bg-[#FFFDF8] border-t-2 border-[#DEC0B8] shadow-[0_-4px_16px_rgba(43,38,34,0.08)] pt-1.5 px-2 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]`}>
        <div className="max-w-xl mx-auto flex items-center justify-around">
          {/* Navigation Items */}
          {isAdmin ? (
            <>
              {/* 1. Home */}
              <button
                onClick={() => handleAdminNav('overview')}
                className={`touch-target min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-all cursor-pointer ${
                  (currentScreen === 'admin' && adminTab === 'overview') || (currentScreen === 'home' && userRole === 'admin')
                    ? 'text-[#1D4ED8] font-bold scale-105'
                    : 'text-[#7C695E] hover:text-[#1D4ED8]'
                }`}
                title="Coordinator Home"
              >
                <div className="relative">
                  <ShieldCheck className="w-5 h-5" />
                  {((currentScreen === 'admin' && adminTab === 'overview') || (currentScreen === 'home' && userRole === 'admin')) && (
                    <span className="absolute -top-1.5 -right-2">
                      <Pushpin color="navy" size="sm" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-['Epilogue'] tracking-tight mt-0.5 whitespace-nowrap">
                  Home
                </span>
              </button>

              {/* 2. Volunteers */}
              <button
                onClick={() => handleAdminNav('volunteers')}
                className={`touch-target min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'admin' && adminTab === 'volunteers'
                    ? 'text-[#1D4ED8] font-bold scale-105'
                    : 'text-[#7C695E] hover:text-[#1D4ED8]'
                }`}
                title="Volunteer IDs & Roster"
              >
                <div className="relative">
                  <Users className="w-5 h-5" />
                  {currentScreen === 'admin' && adminTab === 'volunteers' && (
                    <span className="absolute -top-1.5 -right-2">
                      <Pushpin color="navy" size="sm" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-['Epilogue'] tracking-tight mt-0.5 whitespace-nowrap">
                  Volunteers
                </span>
              </button>

              {/* 3. Assign Tasks */}
              <button
                onClick={() => handleAdminNav('tasks')}
                className={`touch-target min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'admin' && adminTab === 'tasks'
                    ? 'text-[#1D4ED8] font-bold scale-105'
                    : 'text-[#7C695E] hover:text-[#1D4ED8]'
                }`}
                title="Assign Tasks"
              >
                <div className="relative">
                  <Send className="w-5 h-5" />
                  {currentScreen === 'admin' && adminTab === 'tasks' && (
                    <span className="absolute -top-1.5 -right-2">
                      <Pushpin color="navy" size="sm" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-['Epilogue'] tracking-tight mt-0.5 whitespace-nowrap">
                  Assign
                </span>
              </button>

              {/* 4. Reports */}
              <button
                onClick={() => handleAdminNav('moderation')}
                className={`touch-target min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'admin' && adminTab === 'moderation'
                    ? 'text-[#1D4ED8] font-bold scale-105'
                    : 'text-[#7C695E] hover:text-[#1D4ED8]'
                }`}
                title="Review Reports"
              >
                <div className="relative">
                  <ShieldAlert className="w-5 h-5" />
                  {unassignedTasksCount > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-0.5 bg-[#1D4ED8] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
                      {unassignedTasksCount}
                    </span>
                  )}
                  {currentScreen === 'admin' && adminTab === 'moderation' && (
                    <span className="absolute -top-1.5 -right-2">
                      <Pushpin color="navy" size="sm" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-['Epilogue'] tracking-tight mt-0.5 whitespace-nowrap">
                  Reports
                </span>
              </button>

              {/* 5. Stats */}
              <button
                onClick={() => handleAdminNav('analytics')}
                className={`touch-target min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'admin' && adminTab === 'analytics'
                    ? 'text-[#1D4ED8] font-bold scale-105'
                    : 'text-[#7C695E] hover:text-[#1D4ED8]'
                }`}
                title="Volunteer Stats & Progress"
              >
                <div className="relative">
                  <BarChart3 className="w-5 h-5" />
                  {currentScreen === 'admin' && adminTab === 'analytics' && (
                    <span className="absolute -top-1.5 -right-2">
                      <Pushpin color="navy" size="sm" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-['Epilogue'] tracking-tight mt-0.5 whitespace-nowrap">
                  Stats
                </span>
              </button>
            </>
          ) : !isVolunteer ? (
            <>
              {/* Home */}
              <button
                onClick={() => navigateTo('home')}
                className={`touch-target min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'home'
                    ? 'text-[#A03818] font-bold scale-105'
                    : 'text-[#7C695E] hover:text-[#A03818]'
                }`}
              >
                <div className="relative">
                  <LayoutDashboard className="w-5 h-5" />
                  {currentScreen === 'home' && (
                    <span className="absolute -top-1.5 -right-2">
                      <Pushpin color="rust" size="sm" />
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-['Epilogue'] tracking-tight mt-0.5">
                  Home
                </span>
              </button>

              {/* Public Problem Wall */}
              <button
                onClick={() => navigateTo('problem-wall')}
                className={`touch-target min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'problem-wall' || currentScreen === 'problem-detail'
                    ? 'text-[#A03818] font-bold scale-105'
                    : 'text-[#7C695E] hover:text-[#A03818]'
                }`}
              >
                <div className="relative">
                  <ClipboardList className="w-5 h-5" />
                  {(currentScreen === 'problem-wall' || currentScreen === 'problem-detail') && (
                    <span className="absolute -top-1.5 -right-2">
                      <Pushpin color="rust" size="sm" />
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-['Epilogue'] tracking-tight mt-0.5">
                  All Problems
                </span>
              </button>

              {/* CENTER ACTION: Report a Problem */}
              <button
                onClick={() => {
                  if (isCommunityLoggedIn) {
                    navigateTo('report-problem');
                  } else {
                    navigateTo('community-login');
                  }
                }}
                className="touch-target min-h-[48px] relative -top-3 flex flex-col items-center group cursor-pointer"
                aria-label="Report a Problem"
              >
                <div className="w-12 h-12 rounded-full bg-[#A03818] border-2 border-[#FFFDF8] shadow-[0_4px_10px_rgba(160,56,24,0.35)] flex items-center justify-center text-[#FFFDF8] group-hover:bg-[#842504] group-active:scale-95 transition-all">
                  <PlusCircle className="w-6.5 h-6.5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-['Epilogue'] font-black text-[#A03818] tracking-tight mt-0.5">
                  Report
                </span>
              </button>

              {/* The Wins / Impact Gallery */}
              <button
                onClick={() => navigateTo('impact-gallery')}
                className={`touch-target min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'impact-gallery'
                    ? 'text-[#A03818] font-bold scale-105'
                    : 'text-[#7C695E] hover:text-[#A03818]'
                }`}
              >
                <div className="relative">
                  <Trophy className="w-5 h-5" />
                  {currentScreen === 'impact-gallery' && (
                    <span className="absolute -top-1.5 -right-2">
                      <Pushpin color="rust" size="sm" />
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-['Epilogue'] tracking-tight mt-0.5">
                  Solved
                </span>
              </button>

              {/* About / Trust */}
              <button
                onClick={() => navigateTo('about')}
                className={`touch-target min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'about'
                    ? 'text-[#A03818] font-bold scale-105'
                    : 'text-[#7C695E] hover:text-[#A03818]'
                }`}
              >
                <Info className="w-5 h-5" />
                <span className="text-[11px] font-['Epilogue'] tracking-tight mt-0.5">
                  About
                </span>
              </button>
            </>
          ) : (
            /* Volunteer Mode Navigation */
            <>
              {/* Volunteer Dashboard */}
              <button
                onClick={() => navigateTo('home')}
                className={`touch-target min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'home' || currentScreen === 'volunteer-dashboard'
                    ? 'text-[#1B4B43] font-bold scale-105'
                    : 'text-[#7C695E] hover:text-[#1B4B43]'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="text-[10px] font-['Epilogue'] tracking-tight mt-0.5">
                  Home
                </span>
              </button>

              {/* Reports & Volunteer Tasks */}
              <button
                onClick={() => navigateTo('reports-management')}
                className={`touch-target min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'reports-management'
                    ? 'text-[#1B4B43] font-bold scale-105'
                    : 'text-[#7C695E] hover:text-[#1B4B43]'
                }`}
                title="Civic Reports & Tasks"
              >
                <div className="relative">
                  <ClipboardList className="w-5 h-5" />
                  {unassignedTasksCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#1B4B43] text-white rounded-full text-[9px] font-bold flex items-center justify-center font-mono">
                      {unassignedTasksCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-['Epilogue'] tracking-tight mt-0.5">
                  Tasks
                </span>
              </button>

              {/* Action Field Tracker */}
              <button
                onClick={() => navigateTo('action-tracker')}
                className={`touch-target min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'action-tracker'
                    ? 'text-[#1B4B43] font-bold scale-105'
                    : 'text-[#7C695E] hover:text-[#1B4B43]'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-[#1B4B43] text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-['Epilogue'] font-bold text-[#1B4B43] tracking-tight mt-0.5">
                  Tracker
                </span>
              </button>

              {/* Analytics */}
              <button
                onClick={() => navigateTo('analytics')}
                className={`touch-target min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'analytics'
                    ? 'text-[#1B4B43] font-bold scale-105'
                    : 'text-[#7C695E] hover:text-[#1B4B43]'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="text-[10px] font-['Epilogue'] tracking-tight mt-0.5">
                  Stats
                </span>
              </button>

              {/* Cadet Profile */}
              <button
                onClick={() => navigateTo('volunteer-profile')}
                className={`touch-target min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'volunteer-profile'
                    ? 'text-[#1B4B43] font-bold scale-105'
                    : 'text-[#7C695E] hover:text-[#1B4B43]'
                }`}
              >
                <UserCheck className="w-5 h-5" />
                <span className="text-[10px] font-['Epilogue'] tracking-tight mt-0.5">
                  Profile
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. PERSISTENT LEFT SIDEBAR (Tablet & Desktop: 768px and above) */}
      <aside className="hidden md:flex flex-col fixed top-16 left-0 bottom-0 w-60 lg:w-64 bg-[#FFFDF8] border-r-2 border-[#DEC0B8] shadow-[2px_0_12px_rgba(43,38,34,0.06)] z-30 p-3 lg:p-4 overflow-y-auto select-none justify-between">
        <div className="space-y-4">
          {/* Sidebar Role Header */}
          <div className="p-3 bg-[#FAF6ED] border border-[#DEC0B8] rounded-xl relative shadow-2xs mt-2">
            <div className="absolute -top-2 left-3 z-20">
              <Pushpin color={isAdmin ? 'navy' : isVolunteer ? 'teal' : 'rust'} size="sm" />
            </div>
            <div className="pt-1 flex items-center justify-between">
              <div>
                <h3 className="font-['Epilogue'] font-black text-xs text-[#1F1B17] uppercase tracking-wide">
                  {isAdmin ? 'Officer Portal' : isVolunteer ? 'Cadet Station' : 'Community Board'}
                </h3>
                <p className="text-[11px] text-[#7C695E]">
                  {isAdmin ? 'Program Coordinator' : isVolunteer ? 'Field Operations' : 'Civic Voice Noticeboard'}
                </p>
              </div>
              <span
                className={`w-2 h-2 rounded-full ${
                  isAdmin ? 'bg-[#1D4ED8]' : isVolunteer ? 'bg-[#1B4B43]' : 'bg-[#A03818]'
                }`}
              />
            </div>
          </div>

          {/* Navigation Links Column */}
          <nav className="space-y-1.5" aria-label="Sidebar Navigation">
            {isAdmin ? (
              <>
                {/* 1. Officer Hub / Overview */}
                <button
                  onClick={() => handleAdminNav('overview')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-['Epilogue'] font-bold transition-all cursor-pointer ${
                    (currentScreen === 'admin' && adminTab === 'overview') || (currentScreen === 'home' && userRole === 'admin')
                      ? 'bg-[#EBF3FF] text-[#1D4ED8] border-2 border-[#1D4ED8] shadow-xs'
                      : 'bg-transparent text-[#57423C] hover:bg-[#FAF6ED] hover:text-[#1D4ED8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4.5 h-4.5 shrink-0 text-[#1D4ED8]" />
                    <span>Officer Hub</span>
                  </div>
                  {((currentScreen === 'admin' && adminTab === 'overview') || (currentScreen === 'home' && userRole === 'admin')) && (
                    <Pushpin color="navy" size="sm" />
                  )}
                </button>

                {/* 2. Volunteers Roster */}
                <button
                  onClick={() => handleAdminNav('volunteers')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-['Epilogue'] font-bold transition-all cursor-pointer ${
                    currentScreen === 'admin' && adminTab === 'volunteers'
                      ? 'bg-[#EBF3FF] text-[#1D4ED8] border-2 border-[#1D4ED8] shadow-xs'
                      : 'bg-transparent text-[#57423C] hover:bg-[#FAF6ED] hover:text-[#1D4ED8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4.5 h-4.5 shrink-0 text-[#1D4ED8]" />
                    <span>Volunteers</span>
                  </div>
                  {currentScreen === 'admin' && adminTab === 'volunteers' && (
                    <Pushpin color="navy" size="sm" />
                  )}
                </button>

                {/* 3. Assign Tasks */}
                <button
                  onClick={() => handleAdminNav('tasks')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-['Epilogue'] font-bold transition-all cursor-pointer ${
                    currentScreen === 'admin' && adminTab === 'tasks'
                      ? 'bg-[#EBF3FF] text-[#1D4ED8] border-2 border-[#1D4ED8] shadow-xs'
                      : 'bg-transparent text-[#57423C] hover:bg-[#FAF6ED] hover:text-[#1D4ED8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Send className="w-4.5 h-4.5 shrink-0 text-[#1D4ED8]" />
                    <span>Assign Tasks</span>
                  </div>
                  {currentScreen === 'admin' && adminTab === 'tasks' && (
                    <Pushpin color="navy" size="sm" />
                  )}
                </button>

                {/* 4. Review Reports */}
                <button
                  onClick={() => handleAdminNav('moderation')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-['Epilogue'] font-bold transition-all cursor-pointer ${
                    currentScreen === 'admin' && adminTab === 'moderation'
                      ? 'bg-[#EBF3FF] text-[#1D4ED8] border-2 border-[#1D4ED8] shadow-xs'
                      : 'bg-transparent text-[#57423C] hover:bg-[#FAF6ED] hover:text-[#1D4ED8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-[#1D4ED8]" />
                    <span>Review Reports</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {unassignedTasksCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-[#1D4ED8] text-white text-[10px] font-mono font-bold rounded-full">
                        {unassignedTasksCount}
                      </span>
                    )}
                    {currentScreen === 'admin' && adminTab === 'moderation' && (
                      <Pushpin color="navy" size="sm" />
                    )}
                  </div>
                </button>

                {/* 5. Stats */}
                <button
                  onClick={() => handleAdminNav('analytics')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-['Epilogue'] font-bold transition-all cursor-pointer ${
                    currentScreen === 'admin' && adminTab === 'analytics'
                      ? 'bg-[#EBF3FF] text-[#1D4ED8] border-2 border-[#1D4ED8] shadow-xs'
                      : 'bg-transparent text-[#57423C] hover:bg-[#FAF6ED] hover:text-[#1D4ED8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="w-4.5 h-4.5 shrink-0 text-[#1D4ED8]" />
                    <span>Officer Stats</span>
                  </div>
                  {currentScreen === 'admin' && adminTab === 'analytics' && (
                    <Pushpin color="navy" size="sm" />
                  )}
                </button>
              </>
            ) : !isVolunteer ? (
              <>
                {/* 1. Home */}
                <button
                  onClick={() => navigateTo('home')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-['Epilogue'] font-bold transition-all cursor-pointer ${
                    currentScreen === 'home'
                      ? 'bg-[#FFDBD1]/50 text-[#A03818] border-2 border-[#A03818] shadow-xs'
                      : 'bg-transparent text-[#57423C] hover:bg-[#FAF6ED] hover:text-[#A03818]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4.5 h-4.5 shrink-0 text-[#A03818]" />
                    <span>Home</span>
                  </div>
                  {currentScreen === 'home' && <Pushpin color="rust" size="sm" />}
                </button>

                {/* 2. All Problems */}
                <button
                  onClick={() => navigateTo('problem-wall')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-['Epilogue'] font-bold transition-all cursor-pointer ${
                    currentScreen === 'problem-wall' || currentScreen === 'problem-detail'
                      ? 'bg-[#FFDBD1]/50 text-[#A03818] border-2 border-[#A03818] shadow-xs'
                      : 'bg-transparent text-[#57423C] hover:bg-[#FAF6ED] hover:text-[#A03818]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ClipboardList className="w-4.5 h-4.5 shrink-0 text-[#A03818]" />
                    <span>All Problems</span>
                  </div>
                  {(currentScreen === 'problem-wall' || currentScreen === 'problem-detail') && (
                    <Pushpin color="rust" size="sm" />
                  )}
                </button>

                {/* 3. Solved / Wins */}
                <button
                  onClick={() => navigateTo('impact-gallery')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-['Epilogue'] font-bold transition-all cursor-pointer ${
                    currentScreen === 'impact-gallery'
                      ? 'bg-[#FFDBD1]/50 text-[#A03818] border-2 border-[#A03818] shadow-xs'
                      : 'bg-transparent text-[#57423C] hover:bg-[#FAF6ED] hover:text-[#A03818]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-4.5 h-4.5 shrink-0 text-[#A03818]" />
                    <span>Solved Wins</span>
                  </div>
                  {currentScreen === 'impact-gallery' && <Pushpin color="rust" size="sm" />}
                </button>

                {/* 4. About */}
                <button
                  onClick={() => navigateTo('about')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-['Epilogue'] font-bold transition-all cursor-pointer ${
                    currentScreen === 'about'
                      ? 'bg-[#FFDBD1]/50 text-[#A03818] border-2 border-[#A03818] shadow-xs'
                      : 'bg-transparent text-[#57423C] hover:bg-[#FAF6ED] hover:text-[#A03818]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Info className="w-4.5 h-4.5 shrink-0 text-[#A03818]" />
                    <span>About NSS</span>
                  </div>
                  {currentScreen === 'about' && <Pushpin color="rust" size="sm" />}
                </button>

                {/* CTA: Report a Problem Button in Sidebar */}
                <div className="pt-4">
                  <button
                    onClick={() => {
                      if (isCommunityLoggedIn) {
                        navigateTo('report-problem');
                      } else {
                        navigateTo('community-login');
                      }
                    }}
                    className={`w-full py-3 px-3.5 rounded-xl font-['Epilogue'] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                      currentScreen === 'report-problem'
                        ? 'bg-[#842504] text-[#FFFDF8] border-white/60 shadow-lg ring-2 ring-[#A03818]'
                        : 'bg-[#A03818] hover:bg-[#842504] text-[#FFFDF8] border-[#DEC0B8] hover:shadow-lg'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                    <span>Report a Problem</span>
                  </button>
                </div>
              </>
            ) : (
              /* Volunteer Sidebar Navigation */
              <>
                {/* 1. Volunteer Dashboard */}
                <button
                  onClick={() => navigateTo('home')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-['Epilogue'] font-bold transition-all cursor-pointer ${
                    currentScreen === 'home' || currentScreen === 'volunteer-dashboard'
                      ? 'bg-[#B8EADE]/50 text-[#1B4B43] border-2 border-[#1B4B43] shadow-xs'
                      : 'bg-transparent text-[#57423C] hover:bg-[#FAF6ED] hover:text-[#1B4B43]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4.5 h-4.5 shrink-0 text-[#1B4B43]" />
                    <span>Dashboard</span>
                  </div>
                  {(currentScreen === 'home' || currentScreen === 'volunteer-dashboard') && (
                    <Pushpin color="teal" size="sm" />
                  )}
                </button>

                {/* 2. Tasks Queue */}
                <button
                  onClick={() => navigateTo('reports-management')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-['Epilogue'] font-bold transition-all cursor-pointer ${
                    currentScreen === 'reports-management'
                      ? 'bg-[#B8EADE]/50 text-[#1B4B43] border-2 border-[#1B4B43] shadow-xs'
                      : 'bg-transparent text-[#57423C] hover:bg-[#FAF6ED] hover:text-[#1B4B43]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ClipboardList className="w-4.5 h-4.5 shrink-0 text-[#1B4B43]" />
                    <span>Civic Tasks</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {unassignedTasksCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-[#1B4B43] text-white text-[10px] font-mono font-bold rounded-full">
                        {unassignedTasksCount}
                      </span>
                    )}
                    {currentScreen === 'reports-management' && <Pushpin color="teal" size="sm" />}
                  </div>
                </button>

                {/* 3. Action Tracker */}
                <button
                  onClick={() => navigateTo('action-tracker')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-['Epilogue'] font-bold transition-all cursor-pointer ${
                    currentScreen === 'action-tracker'
                      ? 'bg-[#B8EADE]/50 text-[#1B4B43] border-2 border-[#1B4B43] shadow-xs'
                      : 'bg-transparent text-[#57423C] hover:bg-[#FAF6ED] hover:text-[#1B4B43]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-[#1B4B43]" />
                    <span>Action Tracker</span>
                  </div>
                  {currentScreen === 'action-tracker' && <Pushpin color="teal" size="sm" />}
                </button>

                {/* 4. Volunteer Stats */}
                <button
                  onClick={() => navigateTo('analytics')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-['Epilogue'] font-bold transition-all cursor-pointer ${
                    currentScreen === 'analytics'
                      ? 'bg-[#B8EADE]/50 text-[#1B4B43] border-2 border-[#1B4B43] shadow-xs'
                      : 'bg-transparent text-[#57423C] hover:bg-[#FAF6ED] hover:text-[#1B4B43]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="w-4.5 h-4.5 shrink-0 text-[#1B4B43]" />
                    <span>Volunteer Stats</span>
                  </div>
                  {currentScreen === 'analytics' && <Pushpin color="teal" size="sm" />}
                </button>

                {/* 5. Cadet Profile */}
                <button
                  onClick={() => navigateTo('volunteer-profile')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-['Epilogue'] font-bold transition-all cursor-pointer ${
                    currentScreen === 'volunteer-profile'
                      ? 'bg-[#B8EADE]/50 text-[#1B4B43] border-2 border-[#1B4B43] shadow-xs'
                      : 'bg-transparent text-[#57423C] hover:bg-[#FAF6ED] hover:text-[#1B4B43]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-4.5 h-4.5 shrink-0 text-[#1B4B43]" />
                    <span>Cadet Profile</span>
                  </div>
                  {currentScreen === 'volunteer-profile' && <Pushpin color="teal" size="sm" />}
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Sidebar Corkboard Footer Note */}
        <div className="pt-3 border-t border-[#DEC0B8] text-[11px] text-[#7C695E] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-['Epilogue'] font-semibold">Ward 4 Live Noticeboard</span>
          </div>
          <span className="font-mono text-[10px] text-[#8C7A70]">NSS 2026</span>
        </div>
      </aside>
    </>
  );
};
