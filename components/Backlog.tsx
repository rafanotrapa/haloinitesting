import React from 'react';
import { Issue, Priority, IssueType } from '../types';
import { AlertCircle, CheckCircle, Clock, ChevronRight, MoreHorizontal } from 'lucide-react';

interface BacklogProps {
  issues: Issue[];
  onEditIssue: (issue: Issue) => void;
}

const Backlog: React.FC<BacklogProps> = ({ issues, onEditIssue }) => {
  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case Priority.CRITICAL: return 'bg-red-100 text-[#D9232D]';
      case Priority.HIGH: return 'bg-orange-100 text-orange-600';
      case Priority.MEDIUM: return 'bg-blue-100 text-blue-600';
      case Priority.LOW: return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100';
    }
  };

  const getIcon = (type: IssueType) => {
    switch(type) {
      case IssueType.BUG: return <AlertCircle size={16} className="text-[#D9232D]" />;
      case IssueType.STORY: return <CheckCircle size={16} className="text-emerald-500" />;
      case IssueType.TASK: return <CheckCircle size={16} className="text-[#00529C]" />;
      default: return <Clock size={16} className="text-purple-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F2745]">Backlog</h2>
          <p className="text-slate-500 text-sm mt-1">Plan and prioritize upcoming work</p>
        </div>
        <div className="text-sm font-bold text-slate-400">
           {issues.length} Issues
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded-3xl border border-slate-200 shadow-sm custom-scrollbar">
        {issues.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
             <p>No issues found in backlog.</p>
           </div>
        ) : (
          <div className="divide-y divide-slate-100">
             {issues.map((issue) => (
               <div 
                 key={issue.id}
                 onClick={() => onEditIssue(issue)}
                 className="flex flex-col md:flex-row md:items-center p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
               >
                 <div className="flex items-center space-x-4 flex-1 min-w-0 mb-2 md:mb-0">
                    <div className="text-slate-400 group-hover:text-[#0F2745] transition-colors">
                      <ChevronRight size={18} />
                    </div>
                    <div className="flex-shrink-0">
                       {getIcon(issue.type)}
                    </div>
                    <div className="min-w-0">
                       <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-slate-400">{issue.key}</span>
                          <span className="text-sm font-bold text-[#0F2745] truncate block">{issue.title}</span>
                       </div>
                       <p className="text-xs text-slate-400 truncate md:hidden">{issue.description}</p>
                    </div>
                 </div>

                 <div className="flex items-center justify-between md:justify-end md:space-x-6 pl-8 md:pl-0">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${getPriorityColor(issue.priority)} uppercase tracking-wider`}>
                      {issue.priority}
                    </span>
                    
                    <div className="flex items-center space-x-3">
                       {issue.assigneeId ? (
                         <img className="w-6 h-6 rounded-full border border-slate-200" src={`https://picsum.photos/24/24?random=${issue.assigneeId}`} alt="Assignee" />
                       ) : (
                         <div className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">?</div>
                       )}
                       <div className="w-24 text-right">
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                            {issue.status === 'c1' ? 'To Do' : issue.status === 'c2' ? 'In Progress' : issue.status === 'c3' ? 'Review' : 'Done'}
                          </span>
                       </div>
                       <button className="text-slate-300 hover:text-[#0F2745] p-1">
                          <MoreHorizontal size={16} />
                       </button>
                    </div>
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Backlog;