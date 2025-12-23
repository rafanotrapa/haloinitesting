import React from 'react';
import { Issue, IssueType } from '../types';

interface RoadmapProps {
  issues: Issue[];
}

const Roadmap: React.FC<RoadmapProps> = ({ issues }) => {
  const epics = issues.filter(i => i.type === IssueType.EPIC || i.priority === 'Critical'); // Simplified for demo
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return (
    <div className="p-8 h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-[#0F2745]">Project Roadmap 2024</h2>
          <p className="text-slate-500 mt-1">High-level timeline for strategic initiatives</p>
        </div>
        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex space-x-1">
           <button className="px-4 py-1.5 bg-[#0F2745] text-white rounded-lg text-sm font-bold shadow-md">Q1</button>
           <button className="px-4 py-1.5 text-slate-500 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">Q2</button>
           <button className="px-4 py-1.5 text-slate-500 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">Q3</button>
           <button className="px-4 py-1.5 text-slate-500 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">Q4</button>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col shadow-sm card-hover">
        {/* Timeline Header */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 h-14">
           <div className="w-72 flex-shrink-0 border-r border-slate-100 p-4 font-bold text-[#0F2745] text-sm flex items-center">Epic / Initiative</div>
           <div className="flex-1 flex">
             {months.map(m => (
               <div key={m} className="flex-1 border-r border-slate-100 p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-center">{m}</div>
             ))}
           </div>
        </div>

        {/* Timeline Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {epics.map((epic, idx) => {
            // Mock start/duration
            const startMonth = (idx * 2) % 10; 
            const duration = Math.max(2, (idx * 3) % 5);
            const isBlue = idx % 2 === 0;
            
            return (
              <div key={epic.id} className="flex border-b border-slate-100 hover:bg-slate-50/80 transition-colors h-16 items-center group relative">
                <div className="w-72 flex-shrink-0 border-r border-slate-100 p-4 flex flex-col justify-center z-10 bg-inherit">
                  <div className="truncate text-sm font-bold text-[#0F2745]">{epic.title}</div>
                  <span className="text-[10px] font-mono text-slate-400 mt-0.5 bg-slate-100 w-fit px-1.5 rounded">{epic.key}</span>
                </div>
                <div className="flex-1 flex relative h-full items-center px-2">
                   {/* Background Grid Lines */}
                   <div className="absolute inset-0 flex pointer-events-none">
                     {months.map((_, i) => (
                       <div key={i} className="flex-1 border-r border-slate-100/50"></div>
                     ))}
                   </div>
                   
                   {/* The Bar */}
                   <div 
                     className={`h-10 rounded-xl shadow-md relative z-10 flex items-center px-4 text-white text-xs font-bold whitespace-nowrap overflow-hidden transition-all hover:scale-[1.02] cursor-pointer ${
                       isBlue 
                        ? 'bg-gradient-to-r from-[#0F2745] to-[#00529C] shadow-blue-900/20' 
                        : 'bg-gradient-to-r from-[#D9232D] to-[#B01225] shadow-red-900/20'
                     }`}
                     style={{
                       marginLeft: `${(startMonth / 12) * 100}%`,
                       width: `${(duration / 12) * 100}%`
                     }}
                   >
                     {epic.status}
                   </div>
                </div>
              </div>
            );
          })}
          
          {/* Add Ghost Rows for visual filler */}
          {[1,2,3,4,5].map(i => (
             <div key={i} className="flex border-b border-slate-50 h-16 items-center">
               <div className="w-72 flex-shrink-0 border-r border-slate-50 p-4"></div>
               <div className="flex-1 flex h-full">
                  {months.map((_, idx) => (
                       <div key={idx} className="flex-1 border-r border-slate-50"></div>
                  ))}
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;