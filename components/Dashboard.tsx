import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Issue, Priority, ViewMode } from '../types';

interface DashboardProps {
  issues: Issue[];
  onNavigate: (view: ViewMode) => void;
}

// HK Brand Colors for Charts
const COLORS = ['#0F2745', '#D9232D', '#F59E0B', '#10B981']; 
// Blue, Red, Amber, Emerald

const Dashboard: React.FC<DashboardProps> = ({ issues, onNavigate }) => {
  // Data prep
  const statusCounts = issues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(statusCounts).map((status, index) => ({
    name: status,
    value: statusCounts[status]
  }));

  const priorityCounts = issues.reduce((acc, issue) => {
    acc[issue.priority] = (acc[issue.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.keys(Priority).map(key => {
    const p = Priority[key as keyof typeof Priority];
    return {
      name: p,
      count: priorityCounts[p] || 0
    };
  });

  // Mock velocity data
  const velocityData = [
    { name: 'Sprint 1', points: 24 },
    { name: 'Sprint 2', points: 32 },
    { name: 'Sprint 3', points: 28 },
    { name: 'Sprint 4', points: 40 },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 animate-fade-in custom-scrollbar">
      <div className="flex flex-col">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0F2745]">Project Dashboard</h2>
        <p className="text-slate-500 mt-1 text-sm md:text-base">Overview of project velocity and health</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <button 
          onClick={() => onNavigate('BOARD')}
          className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 card-hover text-left group"
        >
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider group-hover:text-[#0F2745] transition-colors">Total Issues</p>
          <p className="text-3xl md:text-4xl font-bold text-[#0F2745] mt-2">{issues.length}</p>
        </button>
        <button 
          onClick={() => onNavigate('BOARD')}
          className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 card-hover text-left group"
        >
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider group-hover:text-[#D9232D] transition-colors">Critical Issues</p>
          <p className="text-3xl md:text-4xl font-bold text-[#D9232D] mt-2">
            {issues.filter(i => i.priority === Priority.CRITICAL).length}
          </p>
        </button>
        <button 
          onClick={() => onNavigate('BACKLOG')}
          className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 card-hover text-left group"
        >
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">Backlog Items</p>
          <p className="text-3xl md:text-4xl font-bold text-emerald-600 mt-2">{issues.length}</p>
        </button>
        <button 
          onClick={() => onNavigate('ROADMAP')}
          className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 card-hover text-left group"
        >
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider group-hover:text-[#00529C] transition-colors">Team Velocity</p>
          <p className="text-3xl md:text-4xl font-bold text-[#00529C] mt-2">32 pts</p>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 pb-6">
        {/* Status Distribution */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 h-[350px] md:h-[400px] card-hover flex flex-col">
          <h3 className="text-lg md:text-xl font-bold mb-6 text-[#0F2745]">Status Distribution</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={8}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#0F2745', fontWeight: 600 }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 h-[350px] md:h-[400px] card-hover flex flex-col">
          <h3 className="text-lg md:text-xl font-bold mb-6 text-[#0F2745]">Issues by Priority</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <Tooltip 
                  cursor={{fill: '#F3F6F8'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#D9232D" radius={[6, 6, 6, 6]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Velocity Chart */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 h-[350px] md:h-[400px] lg:col-span-2 card-hover flex flex-col">
          <h3 className="text-lg md:text-xl font-bold mb-6 text-[#0F2745]">Sprint Velocity & Capacity</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="points" stroke="#00529C" strokeWidth={4} dot={{ r: 6, strokeWidth: 2, fill: '#fff', stroke: '#00529C' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;