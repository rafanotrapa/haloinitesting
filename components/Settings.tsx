import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Slack, Github, Mail, Shield, Zap, Check } from 'lucide-react';
import { AutomationRule, User } from '../types';

interface SettingsProps {
  users: User[];
  currentUser?: User | null;
}

const Settings: React.FC<SettingsProps> = ({ users, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'AUTOMATION' | 'INTEGRATION' | 'ACCESS'>('GENERAL');
  
  const [automations, setAutomations] = useState<AutomationRule[]>([
    { id: '1', name: 'Auto-Assign to QA', trigger: 'When Status changes to Review', action: 'Assign to QA Lead', active: true },
    { id: '2', name: 'Sprint Rollover', trigger: 'When Sprint completes', action: 'Move incomplete to next Sprint', active: false },
    { id: '3', name: 'High Priority Alert', trigger: 'When Priority is Critical', action: 'Send Slack Notification', active: true },
  ]);

  if (currentUser?.role !== 'Admin' && currentUser?.role !== 'Manager') {
    return (
      <div className="p-8 flex items-center justify-center h-full text-slate-500">
        <p>Access Denied. You need Manager privileges to view settings.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto custom-scrollbar">
      <h2 className="text-3xl font-bold text-[#0F2745] mb-2">Project Settings</h2>
      <p className="text-slate-500 mb-8">Manage configuration, automation, and access controls</p>
      
      {/* iOS Segmented Control */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm inline-flex mb-8">
        {['GENERAL', 'AUTOMATION', 'INTEGRATION', 'ACCESS'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
              activeTab === tab 
                ? 'bg-[#0F2745] text-white shadow-md transform scale-105' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {activeTab === 'GENERAL' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm card-hover">
            <h3 className="text-lg font-bold text-[#0F2745] mb-6">Project Details</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Project Name</label>
                 <input type="text" defaultValue="Trans Sumatra Toll Road Phase 2" className="bg-slate-50 w-full border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-[#D9232D] outline-none text-slate-900 transition-all font-medium" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Key</label>
                 <input type="text" defaultValue="TSTR-02" className="bg-slate-50 w-full border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-[#D9232D] outline-none text-slate-900 transition-all font-medium" />
              </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Project Lead</label>
                 <input type="text" defaultValue="Budi Santoso" className="bg-slate-50 w-full border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-[#D9232D] outline-none text-slate-900 transition-all font-medium" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Project Category</label>
                 <select className="bg-slate-50 w-full border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-[#D9232D] outline-none text-slate-900 transition-all font-medium appearance-none">
                   <option>Infrastructure</option>
                   <option>Building</option>
                   <option>Software</option>
                 </select>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button className="bg-[#D9232D] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-red-900/20 transition-all btn-press">Save Changes</button>
            </div>
          </div>
        )}

        {activeTab === 'AUTOMATION' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-[#0F2745] flex items-center"><Zap className="mr-2 text-yellow-500 fill-yellow-500" size={20}/> Automation Rules</h3>
               <button className="text-sm bg-[#0F2745] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#00529C] transition-colors">Create Rule</button>
            </div>
            {automations.map(rule => (
              <div key={rule.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between card-hover">
                <div className="flex items-start space-x-4">
                  <div className={`mt-1 p-2 rounded-lg ${rule.active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F2745] text-lg">{rule.name}</h4>
                    <p className="text-sm text-slate-500 mt-1"><span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs font-bold">IF</span> {rule.trigger} <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs font-bold">THEN</span> {rule.action}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAutomations(prev => prev.map(r => r.id === rule.id ? {...r, active: !r.active} : r))}
                  className="transition-transform active:scale-90"
                >
                  {rule.active ? <ToggleRight className="text-green-500 w-12 h-12" /> : <ToggleLeft className="text-slate-300 w-12 h-12" />}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'INTEGRATION' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-start space-x-5 card-hover">
               <div className="bg-[#4A154B]/10 p-4 rounded-2xl"><Slack className="text-[#4A154B]" size={32} /></div>
               <div className="flex-1">
                 <h4 className="font-bold text-[#0F2745] text-lg">Slack</h4>
                 <p className="text-sm text-slate-500 mb-4 mt-1">Receive real-time notifications in your team channels.</p>
                 <button className="text-xs border-2 border-[#4A154B] text-[#4A154B] px-4 py-2 rounded-xl font-bold hover:bg-[#4A154B] hover:text-white transition-all">Connect</button>
               </div>
             </div>
             <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-start space-x-5 card-hover">
               <div className="bg-slate-100 p-4 rounded-2xl"><Github className="text-slate-800" size={32} /></div>
               <div className="flex-1">
                 <h4 className="font-bold text-[#0F2745] text-lg">GitHub</h4>
                 <p className="text-sm text-slate-500 mb-4 mt-1">Link commits and pull requests directly to issues.</p>
                 <button className="text-xs bg-slate-800 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-900 flex items-center w-fit"><Check size={14} className="mr-1"/> Connected</button>
               </div>
             </div>
             <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-start space-x-5 card-hover">
               <div className="bg-blue-100 p-4 rounded-2xl"><Mail className="text-blue-600" size={32} /></div>
               <div className="flex-1">
                 <h4 className="font-bold text-[#0F2745] text-lg">Email</h4>
                 <p className="text-sm text-slate-500 mb-4 mt-1">Create tasks directly from your Outlook or Gmail inbox.</p>
                 <button className="text-xs border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all">Connect</button>
               </div>
             </div>
          </div>
        )}

        {activeTab === 'ACCESS' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden card-hover">
             <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-[#0F2745] flex items-center text-lg"><Shield className="mr-2 text-slate-400" size={20}/> Role Management</h3>
                <button className="text-sm bg-[#D9232D] text-white px-4 py-2 rounded-xl font-bold hover:shadow-lg hover:shadow-red-900/20 transition-all btn-press">Invite User</button>
             </div>
             <table className="w-full text-left">
               <thead>
                 <tr className="border-b border-slate-100 bg-white">
                   <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                   <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                   <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Last Active</th>
                   <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {users.map(user => (
                   <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                     <td className="p-5 flex items-center space-x-4">
                       <img src={user.avatar} className="w-10 h-10 rounded-full border border-slate-200 shadow-sm" alt="" />
                       <span className="font-bold text-[#0F2745]">{user.name}</span>
                     </td>
                     <td className="p-5">
                       <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                         {user.role}
                       </span>
                     </td>
                     <td className="p-5 text-sm text-slate-500 font-medium">2 hours ago</td>
                     <td className="p-5 text-sm text-[#00529C] font-bold cursor-pointer hover:underline">Edit</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;