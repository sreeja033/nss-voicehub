import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Pushpin } from '../common/Pushpin';
import { RubberStamp } from '../common/RubberStamp';
import { WashiTape } from '../common/WashiTape';
import { VolunteerAvatar } from '../common/VolunteerAvatar';
import {
  ShieldCheck,
  Clock,
  Trophy,
  Award,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  ClipboardCheck,
  Check,
  X,
  Wrench,
  UserCheck,
  BellRing,
  Eye,
  Info,
} from 'lucide-react';

export const VolunteerDashboardScreen: React.FC = () => {
  const {
    currentVolunteer,
    problems,
    acceptAssignment,
    declineAssignment,
    volunteerApproveTask,
    navigateTo,
  } = useApp();

  const [declinePromptId, setDeclinePromptId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  // Assigned directly by Programme Officer / Coordinator to this volunteer
  const assignedToMe = problems.filter(
    (p) =>
      (p.assignedToVolunteerId === currentVolunteer.id ||
        p.assignedLead === currentVolunteer.name ||
        p.assignedVolunteers?.includes(currentVolunteer.name) ||
        (p.assignedLead &&
          p.assignedLead.toLowerCase() ===
            (currentVolunteer.displayName || currentVolunteer.name).toLowerCase())) &&
      p.assignmentStatus !== 'DECLINED' &&
      p.status !== 'SOLVED'
  );

  const pendingAssigned = assignedToMe.filter((p) => p.assignmentStatus === 'PENDING');
  const unassignedProblems = problems.filter((p) => p.status === 'REPORTED' && !p.assignedLead);
  const inProgressProblems = problems.filter(
    (p) =>
      p.status === 'IN_PROGRESS' &&
      (p.assignedToVolunteerId === currentVolunteer.id ||
        p.assignedLead === currentVolunteer.name ||
        p.assignedVolunteers?.includes(currentVolunteer.name))
  );

  const handleConfirmDecline = (problemId: string) => {
    declineAssignment(problemId, declineReason || 'Cadet schedule conflict');
    setDeclinePromptId(null);
    setDeclineReason('');
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 space-y-5">
      {/* Cadet ID Badge Summary Card */}
      <div className="relative bg-[#FFFDF8] border-2 border-[#B8EADE] rounded-2xl p-4 sm:p-5 shadow-[0_4px_14px_rgba(43,38,34,0.08)] -rotate-0.5 mt-4">
        <div className="absolute -top-2.5 left-8 z-20">
          <Pushpin color="teal" size="md" />
        </div>
        <div className="absolute -top-2 right-6 rotate-6 z-20">
          <WashiTape color="mint" width="w-20" />
        </div>

        <div className="flex items-center gap-3.5 pt-2 sm:pt-2.5">
          <VolunteerAvatar
            avatar={currentVolunteer.avatar}
            name={currentVolunteer.displayName || currentVolunteer.name}
            size="lg"
            className="w-14 h-14 rounded-xl border-2 border-[#38665E] shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-['Epilogue'] font-black text-lg text-[#1F1B17] truncate">
                {currentVolunteer.displayName || currentVolunteer.name}
              </h1>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#B8EADE] text-[#1B4B43]">
                Volunteer
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#1B4B43] font-bold">
              ID: {currentVolunteer.id}
            </p>
            <p className="text-xs text-[#57423C] font-semibold">{currentVolunteer.role}</p>
            <p className="text-[11px] text-[#7C695E]">{currentVolunteer.unit}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-1.5 mt-4 pt-3 border-t border-[#B8EADE] text-center">
          <div className="bg-[#FAF6ED] p-1.5 rounded-lg border border-[#B8EADE]">
            <div className="font-['Epilogue'] font-black text-base text-[#1B4B43]">
              {currentVolunteer.hoursCompleted}
            </div>
            <div className="text-[9px] font-bold text-[#6E5A4E] uppercase">Hours</div>
          </div>

          <div className="bg-[#FAF6ED] p-1.5 rounded-lg border border-[#B8EADE]">
            <div className="font-['Epilogue'] font-black text-base text-[#1B4B43]">
              {currentVolunteer.civicWins}
            </div>
            <div className="text-[9px] font-bold text-[#6E5A4E] uppercase">Solved</div>
          </div>

          <div className="bg-[#FAF6ED] p-1.5 rounded-lg border border-[#B8EADE]">
            <div className="font-['Epilogue'] font-black text-base text-[#1B4B43]">
              {assignedToMe.length}
            </div>
            <div className="text-[9px] font-bold text-[#6E5A4E] uppercase">Assigned</div>
          </div>

          <div className="bg-[#FAF6ED] p-1.5 rounded-lg border border-[#B8EADE]">
            <div className="font-['Epilogue'] font-black text-base text-[#38665E]">
              {inProgressProblems.length}
            </div>
            <div className="text-[9px] font-bold text-[#6E5A4E] uppercase">Active</div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => {
            const el = document.getElementById('assigned-tasks-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-3 rounded-xl bg-[#FFFDF8] border-2 border-[#B8EADE] shadow-xs text-left hover:border-[#38665E] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1">
            <ClipboardCheck className="w-5 h-5 text-[#1B4B43]" />
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#B8EADE] text-[#1B4B43]">
              {assignedToMe.length} Tasks
            </span>
          </div>
          <div className="font-['Epilogue'] font-bold text-xs text-[#1F1B17]">
            My Assignments
          </div>
          <div className="text-[10px] text-[#7C695E]">Officer assigned missions</div>
        </button>

        <button
          onClick={() => navigateTo('action-tracker')}
          className="p-3 rounded-xl bg-[#FFFDF8] border-2 border-[#B8EADE] shadow-xs text-left hover:border-[#38665E] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1">
            <CheckCircle2 className="w-5 h-5 text-[#38665E]" />
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#B8EADE] text-[#1B4B43]">
              Active ({inProgressProblems.length})
            </span>
          </div>
          <div className="font-['Epilogue'] font-bold text-xs text-[#1F1B17]">
            Action Tracker
          </div>
          <div className="text-[10px] text-[#7C695E]">Add photos and solve</div>
        </button>
      </div>

      {/* SECTION: Assigned to You (Officer Direct Assignments) */}
      <div id="assigned-tasks-section" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pushpin color="teal" size="sm" />
            <h2 className="font-['Epilogue'] font-black text-base text-[#1F1B17] flex items-center gap-1.5">
              <span>Assigned to You</span>
              {pendingAssigned.length > 0 && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#B8EADE] text-[#1B4B43] border border-[#38665E]/30 animate-pulse">
                  {pendingAssigned.length} New
                </span>
              )}
            </h2>
          </div>
          <span className="text-xs text-[#1B4B43] font-semibold">Officer Direct Assignments</span>
        </div>

        {assignedToMe.length === 0 ? (
          <div className="p-4 bg-[#FFFDF8] border-2 border-dashed border-[#DEC0B8] rounded-xl text-center space-y-1 text-xs text-[#7C695E]">
            <p className="font-semibold text-[#1F1B17]">No active tasks assigned right now.</p>
            <p className="text-[11px]">
              All civic tasks are assigned by the NSS Programme Officer / Unit Admin. When a task is assigned to you, it will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {assignedToMe.map((problem) => {
              const isPending = problem.assignmentStatus === 'PENDING';
              const isDeclining = declinePromptId === problem.id;

              return (
                <div
                  key={problem.id}
                  className={`bg-[#FFFDF8] border-2 rounded-xl p-4 shadow-sm space-y-3 transition-all ${
                    isPending
                      ? 'border-[#38665E] ring-2 ring-[#1B4B43]/20 bg-[#F2FAF7]'
                      : 'border-[#B8EADE]'
                  }`}
                >
                  {/* Top Bar with Coordinator Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <RubberStamp status={problem.status} size="sm" />
                      <span className="text-[11px] font-['Epilogue'] font-bold px-2 py-0.5 rounded-full bg-[#FAF6ED] text-[#57423C] border border-[#DEC0B8]">
                        {problem.category}
                      </span>
                    </div>

                    {/* Badge reading "Assigned by [Officer Name]" */}
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B4B43] bg-[#B8EADE] border border-[#38665E]/30 px-2.5 py-0.5 rounded-full shadow-2xs">
                      <UserCheck className="w-3 h-3 text-[#1B4B43]" />
                      <span>
                        Assigned by <strong>{problem.assignedBy || 'NSS Programme Officer'}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Problem Details */}
                  <div className="space-y-1">
                    <h3 className="font-['Epilogue'] font-bold text-sm text-[#1F1B17]">
                      {problem.title}
                    </h3>
                    <p className="text-xs text-[#6E5A4E] line-clamp-2">{problem.description}</p>
                    <div className="flex items-center gap-1.5 text-xs text-[#7C695E] pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#A03818]" />
                      <span>{problem.location}</span>
                    </div>
                  </div>

                  {/* Target Date and Materials Requisition */}
                  {(problem.targetDate || problem.materialsNeeded) && (
                    <div className="p-2.5 rounded-lg bg-[#FAF6ED] border border-[#DEC0B8] text-[11px] space-y-1 text-[#57423C]">
                      {problem.targetDate && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#1B4B43]" />
                          <span>
                            Target date: <strong>{problem.targetDate}</strong>
                          </span>
                        </div>
                      )}
                      {problem.materialsNeeded && (
                        <div className="flex items-start gap-1.5 text-[#6E5A4E]">
                          <Wrench className="w-3.5 h-3.5 text-[#7B5300] shrink-0 mt-0.5" />
                          <span>
                            Tools & supplies: <strong>{problem.materialsNeeded}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Decline Reason Prompt Form */}
                  {isDeclining ? (
                    <div className="p-3 rounded-xl bg-[#FAF6ED] border border-[#B8EADE] space-y-2 animate-in fade-in duration-150">
                      <div className="text-xs font-['Epilogue'] font-bold text-[#1F1B17]">
                        Decline Assignment
                      </div>
                      <input
                        type="text"
                        value={declineReason || ''}
                        onChange={(e) => setDeclineReason(e.target.value)}
                        placeholder="Reason (optional)..."
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#DEC0B8] rounded-lg text-[#1F1B17] focus:outline-none"
                      />
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setDeclinePromptId(null)}
                          className="px-2.5 py-1 text-xs text-[#7C695E] hover:underline cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleConfirmDecline(problem.id)}
                          className="px-3 py-1 bg-[#57423C] text-white text-xs font-['Epilogue'] font-bold rounded-lg shadow-xs hover:bg-[#1F1B17] cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Assignment Action Bar: Accept and Decline */
                    <div className="pt-2 border-t border-[#F1E6E0] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => navigateTo('problem-detail', problem.id)}
                          className="text-xs text-[#7C695E] hover:text-[#1B4B43] underline cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => setDeclinePromptId(problem.id)}
                              className="px-3 py-1.5 rounded-lg border border-[#DEC0B8] bg-white text-[#57423C] hover:text-[#1F1B17] text-xs font-['Epilogue'] font-bold flex items-center gap-1 shadow-2xs hover:bg-[#FAF6ED] cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>

                            <button
                              onClick={() => {
                                acceptAssignment(problem.id);
                                navigateTo('action-tracker', problem.id);
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-[#1B4B43] hover:bg-[#153a34] text-white text-xs font-['Epilogue'] font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept & Work on Task</span>
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#1B4B43] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>In Progress</span>
                            </span>
                            <button
                              onClick={() => navigateTo('action-tracker', problem.id)}
                              className="px-3 py-1 rounded-lg bg-[#38665E] text-white text-xs font-['Epilogue'] font-bold shadow-xs hover:bg-[#1B4B43] cursor-pointer"
                            >
                              Work on Task →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION: Ward Civic Queue */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pushpin color="teal" size="sm" />
            <h2 className="font-['Epilogue'] font-black text-base text-[#1F1B17]">
              Ward Noticeboard ({unassignedProblems.length})
            </h2>
          </div>
          <button
            onClick={() => navigateTo('reports-management')}
            className="text-xs text-[#1B4B43] font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>All Reports & Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Policy note */}
        <div className="p-3 bg-[#FAF6ED] border border-[#B8EADE] rounded-xl flex items-start gap-2.5 text-xs text-[#57423C]">
          <Info className="w-4 h-4 text-[#1B4B43] shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>Civic Field Remediation:</strong> Volunteers can approve and take up unassigned ward reports. Click &quot;Approve &amp; Work on Task&quot; to begin remediation and track progress photos.
          </p>
        </div>

        {unassignedProblems.length === 0 ? (
          <div className="p-5 text-center bg-[#FFFDF8] border border-[#DEC0B8] rounded-xl text-xs text-[#6E5A4E]">
            All reported ward notices have been reviewed and taken up by field volunteers!
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {unassignedProblems.slice(0, 4).map((problem) => (
              <div
                key={problem.id}
                className="bg-[#FFFDF8] border-2 border-[#DEC0B8] hover:border-[#38665E] transition-all rounded-xl p-4 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <RubberStamp status="REPORTED" size="sm" />
                    <span className="text-[11px] font-['Epilogue'] font-bold px-2 py-0.5 rounded-full bg-[#B8EADE]/40 text-[#1B4B43] border border-[#38665E]/20">
                      {problem.category}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-['Epilogue'] font-bold text-sm text-[#1F1B17]">
                      {problem.title}
                    </h3>
                    <p className="text-xs text-[#6E5A4E] line-clamp-2">{problem.description}</p>
                    <div className="flex items-center gap-1.5 text-xs text-[#7C695E] pt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#A03818]" />
                      <span>{problem.location}</span>
                    </div>
                  </div>
                </div>

                {/* Volunteer Action Footer */}
                <div className="pt-2.5 border-t border-[#F1E6E0] flex items-center justify-between gap-2">
                  <button
                    onClick={() => navigateTo('problem-detail', problem.id)}
                    className="touch-target min-h-[38px] py-1.5 px-3 rounded-lg font-['Epilogue'] font-bold text-xs bg-[#FAF6ED] hover:bg-[#DEC0B8]/40 text-[#57423C] border border-[#DEC0B8] flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Notice</span>
                  </button>

                  {/* CHANGED FROM ORANGE TO GREEN CORK-BTN-TEAL WITH TOUCH-TARGET FOR POLISHED WEB APP */}
                  <button
                    onClick={() => {
                      volunteerApproveTask(problem.id);
                      navigateTo('action-tracker', problem.id);
                    }}
                    className="touch-target min-h-[38px] py-1.5 px-3.5 rounded-lg font-['Epilogue'] font-bold text-xs cork-btn-teal text-white flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-98"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Approve &amp; Work on Task</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION: Active Missions */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pushpin color="teal" size="sm" />
            <h2 className="font-['Epilogue'] font-black text-base text-[#1F1B17]">
              Active Tasks ({inProgressProblems.length})
            </h2>
          </div>
          <button
            onClick={() => navigateTo('action-tracker')}
            className="text-xs font-['Epilogue'] font-bold text-[#38665E] hover:underline cursor-pointer"
          >
            View Tracker →
          </button>
        </div>

        {inProgressProblems.length === 0 ? (
          <div className="bg-[#FAF6ED] border border-dashed border-[#B8EADE] rounded-xl p-4 text-center">
            <p className="text-xs text-[#57423C] font-semibold">0 active tasks right now.</p>
            <p className="text-[11px] text-[#7C695E] mt-0.5">
              Accept an officer-assigned mission above to begin civic work.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {inProgressProblems.slice(0, 4).map((problem) => (
              <div
                key={problem.id}
                onClick={() => navigateTo('action-tracker', problem.id)}
                className="bg-[#FFFDF8] border-2 border-[#B8EADE] rounded-xl p-4 shadow-xs hover:border-[#38665E] transition-all cursor-pointer space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RubberStamp status="IN_PROGRESS" size="sm" />
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#B8EADE] text-[#1B4B43] font-bold">
                      Assigned by {problem.assignedBy || 'NSS Programme Officer'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1B4B43]">
                    {problem.updates.length} Updates
                  </span>
                </div>

                <h3 className="font-['Epilogue'] font-bold text-sm text-[#1F1B17]">
                  {problem.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-[#57423C]">
                  <span>{problem.location}</span>
                  <span className="text-[#1B4B43] font-bold flex items-center gap-1">
                    Update →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION: Upcoming Civic Drives Calendar */}
      <div className="bg-[#FFFDF8] border-2 border-[#B8EADE] rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-[#B8EADE] pb-2">
          <Calendar className="w-4 h-4 text-[#1B4B43]" />
          <h3 className="font-['Epilogue'] font-bold text-sm text-[#1F1B17]">
            Upcoming Events
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-[#FAF6ED] border border-[#B8EADE] flex items-start gap-3">
            <div className="text-center font-['Epilogue'] font-bold px-2 py-1 rounded bg-[#B8EADE] text-[#1B4B43] shrink-0">
              <div className="text-[10px] uppercase">SAT</div>
              <div className="text-sm font-black">18</div>
            </div>
            <div>
              <div className="font-bold text-[#1F1B17]">Drain Cleaning Drive</div>
              <div className="text-[#6E5A4E]">Patel Colony Alley • 10:00 AM • 8 volunteers</div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#FAF6ED] border border-[#B8EADE] flex items-start gap-3">
            <div className="text-center font-['Epilogue'] font-bold px-2 py-1 rounded bg-[#B8EADE] text-[#1B4B43] shrink-0">
              <div className="text-[10px] uppercase">SUN</div>
              <div className="text-sm font-black">19</div>
            </div>
            <div>
              <div className="font-bold text-[#1F1B17]">Tree Planting Drive</div>
              <div className="text-[#6E5A4E]">Green Ribbon Boulevard • 8:30 AM • All welcome</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
