import React from 'react';
import { Problem } from '../../types';
import { useApp } from '../../context/AppContext';
import { Pushpin } from './Pushpin';
import { RubberStamp } from './RubberStamp';
import {
  MapPin,
  ThumbsUp,
  Eye,
  MessageSquare,
  Link2,
  AlertTriangle,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { formatRelativeTime, formatDateChip } from '../../utils/dateUtils';

interface ProblemCardProps {
  problem: Problem;
  rotation?: number;
  showActions?: boolean;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  rotation = 0,
  showActions = true,
}) => {
  const {
    navigateTo,
    toggleUpvote,
    toggleAdopt,
    upvotedProblemIds,
    adoptedProblemIds,
  } = useApp();

  const isUpvoted = upvotedProblemIds.includes(problem.id);
  const isAdopted = adoptedProblemIds.includes(problem.id);

  const getPinColor = () => {
    if (problem.status === 'SOLVED') return 'teal';
    if (problem.status === 'IN_PROGRESS') return 'mustard';
    return 'rust';
  };

  const handleCardClick = () => {
    navigateTo('problem-detail', problem.id);
  };

  return (
    <div
      style={{ transform: `rotate(${rotation * 0.4}deg)` }}
      className="relative w-[calc(100%-4px)] mx-auto bg-[#FFFDF8] border-2 border-[#DEC0B8] rounded-xl p-3.5 sm:p-4 shadow-[0_3px_12px_rgba(43,38,34,0.06)] hover:shadow-[0_8px_20px_rgba(43,38,34,0.12)] hover:-translate-y-0.5 hover:rotate-0 transition-all duration-200 group cursor-pointer max-w-full flex flex-col justify-between mt-3"
      onClick={handleCardClick}
    >
      {/* 3D Pushpin on top center */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20">
        <Pushpin color={getPinColor()} size="md" />
      </div>

      <div>
        {/* Top Meta Line: Status Chip + Priority Chip + Category */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 mb-2">
          {/* Status Chip */}
          {problem.status === 'SOLVED' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#B8EADE]/70 text-[#1B4B43] border border-[#38665E]/30 text-[10px] font-['Epilogue'] font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43]" />
              🟢 Solved
            </span>
          ) : problem.status === 'IN_PROGRESS' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFDDAE]/70 text-[#7B5300] border border-[#E8A93A]/40 text-[10px] font-['Epilogue'] font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8A93A] animate-pulse" />
              🟡 NSS Working
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFDBD1]/70 text-[#A03818] border border-[#A03818]/30 text-[10px] font-['Epilogue'] font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A03818]" />
              🔴 Reported
            </span>
          )}

          <div className="flex items-center gap-1.5">
            {/* Priority Chip */}
            {problem.urgent ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#FFDBD1] text-[#A03818] border border-[#A03818]/30 text-[10px] font-['Epilogue'] font-black tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A03818] animate-pulse" />
                High Priority
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#FCF2EB] text-[#6E5A4E] border border-[#DEC0B8] text-[10px] font-['Epilogue'] font-semibold">
                Normal
              </span>
            )}

            <span className="text-[10px] font-['Epilogue'] font-bold px-2 py-0.5 rounded-full bg-[#FAF6ED] text-[#57423C] border border-[#DEC0B8]">
              {problem.category}
            </span>
          </div>
        </div>

        {/* Main Content & Thumbnail */}
        <div className="flex gap-2.5">
          {/* Photo thumbnail */}
          {problem.photoUrl && (
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden border border-[#DEC0B8] shadow-2xs bg-[#FAF6ED]">
              <img
                src={problem.photoUrl}
                alt={problem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {problem.status === 'SOLVED' && (
                <div className="absolute inset-0 bg-[#1B4B43]/30 flex items-center justify-center">
                  <span className="text-white text-xs font-black drop-shadow-md">✓</span>
                </div>
              )}
            </div>
          )}

          {/* Text Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-['Epilogue'] font-extrabold text-xs sm:text-sm text-[#1F1B17] line-clamp-2 leading-snug group-hover:text-[#A03818] transition-colors">
              {problem.title}
            </h3>

            <p className="text-[11px] sm:text-xs text-[#6E5A4E] line-clamp-2 mt-0.5 leading-normal">
              {problem.description}
            </p>

            {/* Location line with pin icon */}
            <div className="flex items-center gap-1 mt-1.5 text-[11px] font-medium text-[#7C695E]">
              <MapPin className="w-3 h-3 text-[#A03818] shrink-0" />
              <span className="truncate">{problem.location}</span>
            </div>
          </div>
        </div>

        {/* Date Chip & Squad note */}
        <div className="mt-2.5 pt-2 border-t border-[#F1E6E0] flex flex-wrap items-center justify-between gap-1.5 text-xs">
          <div className="flex items-center gap-1.5">
            {problem.linkedDuplicatesCount > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-[#7B5300] bg-[#FFDDAE]/60 px-1.5 py-0.5 rounded font-bold">
                <Link2 className="w-2.5 h-2.5" />
                <span>+{problem.linkedDuplicatesCount}</span>
              </span>
            )}

            {problem.assignedSquad && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1B4B43] bg-[#B8EADE]/60 px-1.5 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3" />
                <span className="truncate max-w-[110px]">{problem.assignedSquad}</span>
              </span>
            )}
          </div>

          {/* Relative Date Chip */}
          <span
            className="inline-flex items-center gap-1 text-[10px] text-[#6E5A4E] font-medium bg-[#FAF6ED] px-1.5 py-0.5 rounded border border-[#DEC0B8]/60"
            title={problem.createdAt}
          >
            <Clock className="w-2.5 h-2.5 text-[#A8988D] shrink-0" />
            <span>{formatDateChip(problem.createdAt)}</span>
          </span>
        </div>

        {/* Simple Progress Indicator: Reported → Assigned → Solved */}
        <div className="mt-2 pt-2 border-t border-[#DEC0B8]/30">
          <div className="flex items-center justify-between text-[9.5px] font-['Epilogue'] font-bold mb-1">
            <span className={problem.status === 'REPORTED' || problem.status === 'IN_PROGRESS' || problem.status === 'SOLVED' ? 'text-[#A03818] font-black flex items-center gap-0.5' : 'text-[#8C7A70]'}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#A03818]" />
              Reported
            </span>
            <span className="text-[#DEC0B8] text-[8px]">→</span>
            <span className={problem.status === 'IN_PROGRESS' || problem.status === 'SOLVED' ? 'text-[#7B5300] font-black flex items-center gap-0.5' : 'text-[#8C7A70]'}>
              <span className={`w-1.5 h-1.5 rounded-full ${problem.status === 'IN_PROGRESS' || problem.status === 'SOLVED' ? 'bg-[#E8A93A]' : 'bg-[#DEC0B8]'}`} />
              Assigned
            </span>
            <span className="text-[#DEC0B8] text-[8px]">→</span>
            <span className={problem.status === 'SOLVED' ? 'text-[#1B4B43] font-black flex items-center gap-0.5' : 'text-[#8C7A70]'}>
              <span className={`w-1.5 h-1.5 rounded-full ${problem.status === 'SOLVED' ? 'bg-[#1B4B43]' : 'bg-[#DEC0B8]'}`} />
              Solved
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#FAF6ED] border border-[#DEC0B8]/60 rounded-full overflow-hidden flex gap-0.5">
            <div className={`h-full flex-1 rounded-l-full ${
              problem.status === 'REPORTED' || problem.status === 'IN_PROGRESS' || problem.status === 'SOLVED' ? 'bg-[#A03818]' : 'bg-[#DEC0B8]'
            }`} />
            <div className={`h-full flex-1 ${
              problem.status === 'IN_PROGRESS' || problem.status === 'SOLVED' ? 'bg-[#E8A93A]' : 'bg-[#DEC0B8]/40'
            }`} />
            <div className={`h-full flex-1 rounded-r-full ${
              problem.status === 'SOLVED' ? 'bg-[#1B4B43]' : 'bg-[#DEC0B8]/40'
            }`} />
          </div>
        </div>
      </div>

      {/* Action Footer: Upvote & Adopt Buttons */}
      {showActions && (
        <div
          className="mt-2.5 pt-2 border-t border-[#DEC0B8]/60 flex items-center justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Agreement / Upvote */}
          <button
            onClick={() => toggleUpvote(problem.id)}
            className={`touch-target min-h-[38px] inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-['Epilogue'] font-bold transition-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
              isUpvoted
                ? 'bg-[#A03818] text-white border-[#842504] shadow-xs'
                : 'bg-[#FFFDF8] text-[#57423C] border-[#DEC0B8] hover:bg-[#FFDBD1]/40'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-white' : ''}`} />
            <span>{problem.upvotes}</span>
            <span className="hidden sm:inline font-normal text-[10.5px] opacity-80">
              I Agree
            </span>
          </button>

          <div className="flex items-center gap-1">
            {/* Watch problem */}
            <button
              onClick={() => toggleAdopt(problem.id)}
              className={`touch-target min-h-[38px] inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-['Epilogue'] font-medium transition-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                isAdopted
                  ? 'bg-[#FFDBD1]/80 text-[#A03818] border-[#A03818]'
                  : 'bg-[#FFFDF8] text-[#57423C] border-[#DEC0B8] hover:bg-[#FAF6ED]'
              }`}
              title="Watch this problem to get updates"
            >
              <Eye className="w-3.5 h-3.5 text-[#A03818]" />
              <span>{problem.adoptersCount}</span>
              <span className="hidden sm:inline text-[10px] text-[#57423C]">watch</span>
            </button>

            {/* Comments badge */}
            <button
              onClick={handleCardClick}
              className="touch-target min-h-[38px] min-w-[38px] inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-[#7C695E] hover:text-[#A03818] hover:scale-[1.05] transition-transform cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#A03818]" />
              <span>{problem.comments?.length || 0}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
