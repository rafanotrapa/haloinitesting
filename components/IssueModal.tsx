import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, CheckCircle, Clock, ChevronDown } from 'lucide-react';
import { Issue, Priority, IssueType, User, Column } from '../types';
import { generateIssueDescription, suggestSubtasks } from '../services/geminiService';

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (issue: Partial<Issue>) => void;
  issue?: Issue; // If undefined, we are creating new
  columns: Column[];
  users: User[];
  defaultStatus?: string;
  isReadOnly?: boolean;
}

const IssueModal: React.FC<IssueModalProps> = ({ isOpen, onClose, onSave, issue, columns, users, defaultStatus, isReadOnly = false }) => {
  const [title, setTitle] = useState(issue?.title || '');
  const [description, setDescription] = useState(issue?.description || '');
  const [priority, setPriority] = useState<Priority>(issue?.priority || Priority.MEDIUM);
  const [type, setType] = useState<IssueType>(issue?.type || IssueType.TASK);
  const [status, setStatus] = useState(issue?.status || defaultStatus || columns[0]?.id);
  const [assigneeId, setAssigneeId] = useState(issue?.assigneeId || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [subtasks, setSubtasks] = useState<string[]>([]);

  useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDescription(issue.description);
      setPriority(issue.priority);
      setType(issue.type);
      setStatus(issue.status);
      setAssigneeId(issue.assigneeId || '');
    } else {
      // Reset for new issue
      setTitle('');
      setDescription('');
      setPriority(Priority.MEDIUM);
      setStatus(defaultStatus || columns[0]?.id);
    }
    setSubtasks([]);
  }, [issue, isOpen, defaultStatus, columns]);

  const handleGenerateDescription = async () => {
    if (!title) return;
    setIsGenerating(true);
    const desc = await generateIssueDescription(title, type);
    setDescription(prev => prev ? prev + "\n\n" + desc : desc);
    setIsGenerating(false);
  };

  const handleSuggestSubtasks = async () => {
    if (!description) return;
    setIsGenerating(true);
    const tasks = await suggestSubtasks(description);
    setSubtasks(tasks);
    setIsGenerating(false);
  };

  const handleSave = () => {
    onSave({
      id: issue?.id, // undefined if new
      title,
      description,
      priority,
      type,
      status,
      assigneeId,
      comments: issue?.comments || []
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F2745]/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-[95%] md:w-full md:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col ring-1 ring-white/20 transform transition-all scale-100">
        {/* Header */}
        <div className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-md tracking-wider">{issue?.key || 'NEW-ISSUE'}</span>
            {isReadOnly && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">READ ONLY</span>}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-[#0F2745] bg-white p-2 rounded-full hover:bg-slate-100 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8 space-y-8 custom-scrollbar">
          <input 
            type="text" 
            placeholder="What needs to be done?" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isReadOnly}
            className="w-full text-xl md:text-2xl font-bold placeholder-slate-300 bg-white border-none outline-none focus:ring-0 text-[#0F2745] disabled:bg-white p-0"
            autoFocus
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Status</label>
              <div className="relative">
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={isReadOnly}
                  className="w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:border-[#00529C] focus:ring-2 focus:ring-blue-100 outline-none text-slate-700 appearance-none transition-all cursor-pointer hover:bg-white"
                >
                  {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Priority</label>
              <div className="relative">
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  disabled={isReadOnly}
                  className="w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:border-[#00529C] focus:ring-2 focus:ring-blue-100 outline-none text-slate-700 appearance-none transition-all cursor-pointer hover:bg-white"
                >
                  {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Type</label>
              <div className="relative">
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as IssueType)}
                  disabled={isReadOnly}
                  className="w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:border-[#00529C] focus:ring-2 focus:ring-blue-100 outline-none text-slate-700 appearance-none transition-all cursor-pointer hover:bg-white"
                >
                  {Object.values(IssueType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Assignee</label>
              <div className="relative">
                <select 
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  disabled={isReadOnly}
                  className="w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:border-[#00529C] focus:ring-2 focus:ring-blue-100 outline-none text-slate-700 appearance-none transition-all cursor-pointer hover:bg-white"
                >
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
              </div>
            </div>
          </div>

          <div className="relative">
             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
                <label className="block text-sm font-bold text-[#0F2745]">Description</label>
                {!isReadOnly && (
                  <div className="flex space-x-3">
                    <button 
                      onClick={handleGenerateDescription}
                      disabled={isGenerating || !title}
                      className="flex items-center space-x-1.5 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 disabled:opacity-50 transition-colors"
                    >
                      <Sparkles size={14} />
                      <span>{isGenerating ? 'Thinking...' : 'AI Write'}</span>
                    </button>
                    <button 
                      onClick={handleSuggestSubtasks}
                      disabled={isGenerating || !description}
                      className="flex items-center space-x-1.5 text-xs font-bold text-[#00529C] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
                    >
                      <Sparkles size={14} />
                      <span>AI Subtasks</span>
                    </button>
                  </div>
                )}
             </div>
             <textarea 
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               disabled={isReadOnly}
               className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm leading-relaxed focus:bg-white focus:border-[#00529C] focus:ring-4 focus:ring-blue-50 outline-none resize-none text-slate-700 disabled:bg-slate-50 transition-all"
               placeholder="Describe the task, acceptance criteria, etc..."
             />
          </div>

          {subtasks.length > 0 && (
             <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100">
               <h4 className="text-xs font-bold text-[#00529C] mb-3 flex items-center uppercase tracking-wide"><Sparkles size={14} className="mr-2 fill-blue-400"/> AI Suggestions</h4>
               <ul className="space-y-2">
                 {subtasks.map((task, i) => (
                   <li key={i} className="flex items-center text-sm font-medium text-slate-700 bg-white/60 p-2 rounded-lg">
                     <input type="checkbox" className="mr-3 h-4 w-4 rounded border-slate-300 text-[#00529C] focus:ring-[#00529C]" disabled={isReadOnly} />
                     {task}
                   </li>
                 ))}
               </ul>
             </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end space-x-4">
          <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-[#0F2745] hover:bg-white rounded-xl transition-all">Cancel</button>
          {!isReadOnly && (
            <button onClick={handleSave} className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#D9232D] to-[#B01225] rounded-xl hover:shadow-lg hover:shadow-red-900/20 active:scale-95 transition-all">
              {issue ? 'Save Changes' : 'Create Issue'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueModal;