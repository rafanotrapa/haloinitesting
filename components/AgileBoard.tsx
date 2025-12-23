import React, { useState } from 'react';
import { Issue, Column, Priority, IssueType } from '../types';
import { MoreHorizontal, Plus, AlertCircle, CheckCircle, Clock, ArrowUp } from 'lucide-react';

interface AgileBoardProps {
  issues: Issue[];
  columns: Column[];
  onStatusChange: (issueId: string, newStatus: string) => void;
  onEditIssue: (issue: Issue) => void;
  onNewIssue: (status: string) => void;
  isReadOnly?: boolean;
}

const AgileBoard: React.FC<AgileBoardProps> = ({ issues, columns, onStatusChange, onEditIssue, onNewIssue, isReadOnly = false }) => {
  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case Priority.CRITICAL: return 'bg-red-50 text-[#D9232D] ring-1 ring-[#D9232D]/20';
      case Priority.HIGH: return 'bg-orange-50 text-orange-600 ring-1 ring-orange-200';
      case Priority.MEDIUM: return 'bg-blue-50 text-blue-600 ring-1 ring-blue-200';
      case Priority.LOW: return 'bg-slate-100 text-slate-600 ring-1 ring-slate-200';
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

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, issueId: string) => {
    if (isReadOnly) return;
    setDraggedIssueId(issueId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    if (isReadOnly) return;
    e.preventDefault(); // Necessary to allow dropping
    if (dragOverColumnId !== columnId) {
      setDragOverColumnId(columnId);
    }
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    if (isReadOnly) return;
    e.preventDefault();
    setDragOverColumnId(null);
    if (draggedIssueId) {
      onStatusChange(draggedIssueId, columnId);
      setDraggedIssueId(null);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Responsive Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-8 py-6 shrink-0 gap-4">
        <div>
           <h2 className="text-2xl md:text-3xl font-bold text-[#0F2745]">Sprint 24 Board</h2>
           <p className="text-slate-500 text-sm mt-1">Hutama Karya Infrastructure Division</p>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <img key={i} className="w-10 h-10 rounded-full border-[3px] border-[#F3F6F8] shadow-sm" src={`https://picsum.photos/32/32?random=${i}`} alt="User" />
            ))}
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xs font-bold text-[#0F2745] border-[3px] border-[#F3F6F8] shadow-sm">+5</div>
          </div>
          {!isReadOnly && (
            <button className="px-6 py-2.5 bg-white text-[#0F2745] border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 hover:shadow-md transition-all btn-press">
              Complete
            </button>
          )}
        </div>
      </div>

      {/* Board Area */}
      {/* Added p-1 and increased horizontal padding to ensure outlines/rings are not clipped */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 md:px-8 pb-6 custom-scrollbar">
        <div className="flex h-full space-x-6 min-w-max p-1"> 
          {columns.map(column => {
            const columnIssues = issues.filter(i => i.status === column.id);
            const isDragOver = dragOverColumnId === column.id;

            return (
              <div 
                key={column.id} 
                className={`w-80 flex flex-col h-full rounded-3xl transition-all duration-300 ${
                  isDragOver 
                    ? 'bg-blue-50/80 ring-2 ring-[#00529C] ring-offset-2' 
                    : 'bg-slate-100/50'
                }`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className="p-5 flex justify-between items-center shrink-0">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-[#0F2745] text-sm uppercase tracking-wider">{column.title}</span>
                    <span className="bg-white text-slate-600 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">{columnIssues.length}</span>
                  </div>
                  {!isReadOnly && (
                    <button 
                      onClick={() => onNewIssue(column.id)} 
                      className="text-slate-400 hover:text-[#0F2745] hover:bg-white p-1.5 rounded-lg transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  )}
                </div>
                
                {/* Column Body */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 custom-scrollbar">
                  {columnIssues.map(issue => (
                    <div 
                      key={issue.id} 
                      draggable={!isReadOnly}
                      onDragStart={(e) => handleDragStart(e, issue.id)}
                      onClick={() => onEditIssue(issue)}
                      className={`bg-white p-5 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 group ${
                        isReadOnly ? 'cursor-pointer hover:shadow-md' : 'cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:shadow-lg'
                      } transition-all duration-200 ${
                        draggedIssueId === issue.id 
                          ? 'opacity-40 rotate-2 scale-95 shadow-none border-dashed border-slate-400' 
                          : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[11px] font-bold text-slate-400 hover:text-[#00529C] transition-colors">{issue.key}</span>
                        {!isReadOnly && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-50 rounded">
                             <MoreHorizontal size={16} className="text-slate-400" />
                          </div>
                        )}
                      </div>
                      
                      <p className="text-[15px] font-semibold text-[#0F2745] mb-4 leading-snug">{issue.title}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2.5">
                          {getIcon(issue.type)}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getPriorityColor(issue.priority)}`}>
                            {issue.priority}
                          </span>
                        </div>
                        {issue.assigneeId && (
                           <img className="w-7 h-7 rounded-full border border-white shadow-sm" src={`https://picsum.photos/24/24?random=${issue.assigneeId}`} alt="Assignee" />
                        )}
                      </div>
                    </div>
                  ))}
                  {!isReadOnly && (
                    <button 
                      onClick={() => onNewIssue(column.id)}
                      className="w-full py-3 flex items-center justify-center text-sm font-medium text-slate-400 hover:text-[#00529C] hover:bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#00529C]/30 transition-all btn-press"
                    >
                      <Plus size={18} className="mr-2"/> Create Issue
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AgileBoard;