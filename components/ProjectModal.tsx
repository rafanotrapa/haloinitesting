import React, { useState } from 'react';
import { X, Building2, Users, Briefcase } from 'lucide-react';
import { Project, User } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Partial<Project>) => void;
  currentUser: User;
  users: User[];
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave, currentUser, users }) => {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([currentUser.id]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name || !key) return;
    
    onSave({
      name,
      key: key.toUpperCase(),
      description,
      managerId: currentUser.id,
      memberIds: selectedMembers,
      createdAt: new Date()
    });
    
    // Reset form
    setName('');
    setKey('');
    setDescription('');
    setSelectedMembers([currentUser.id]);
    onClose();
  };

  const toggleMember = (userId: string) => {
    if (userId === currentUser.id) return; // Cannot remove self
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F2745]/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-[95%] md:w-full md:max-w-lg overflow-hidden flex flex-col ring-1 ring-white/20 transform transition-all scale-100">
        <div className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="bg-[#D9232D] p-1.5 rounded-lg">
                <Briefcase size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-[#0F2745]">New Project</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-[#0F2745] bg-white p-2 rounded-full hover:bg-slate-100 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Project Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Trans Sumatra Phase 3"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-[#D9232D] outline-none text-slate-900 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Project Key (Prefix)</label>
            <input 
              type="text" 
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="e.g., TSP3"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-[#D9232D] outline-none text-slate-900 font-mono uppercase"
              maxLength={6}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the project goals..."
              className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-[#D9232D] outline-none text-slate-700 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3 flex items-center">
                <Users size={14} className="mr-1"/> Project Members (Access Control)
            </label>
            <div className="max-h-40 overflow-y-auto custom-scrollbar border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                {users.map(user => (
                    <div 
                        key={user.id} 
                        onClick={() => toggleMember(user.id)}
                        className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${selectedMembers.includes(user.id) ? 'bg-white shadow-sm border border-slate-200' : 'hover:bg-slate-200/50'}`}
                    >
                        <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${selectedMembers.includes(user.id) ? 'bg-[#D9232D] border-[#D9232D]' : 'border-slate-300'}`}>
                            {selectedMembers.includes(user.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <img src={user.avatar} className="w-6 h-6 rounded-full mr-2" alt="" />
                        <span className={`text-sm ${selectedMembers.includes(user.id) ? 'font-bold text-[#0F2745]' : 'text-slate-500'}`}>{user.name}</span>
                        {user.id === currentUser.id && <span className="ml-auto text-[10px] bg-slate-200 text-slate-600 px-1.5 rounded">PM</span>}
                    </div>
                ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-2">* Only selected members will be able to view and edit this project.</p>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end space-x-4">
          <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-[#0F2745] transition-all">Cancel</button>
          <button 
            onClick={handleSave} 
            disabled={!name || !key}
            className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#D9232D] to-[#B01225] rounded-xl hover:shadow-lg hover:shadow-red-900/20 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;