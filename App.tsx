import React, { useState, useEffect } from 'react';
import { 
  Layout, Kanban, CheckSquare, Calendar, PieChart, Settings as SettingsIcon, 
  Search, Bell, Menu, User, PlusCircle, Building2, LogOut, ChevronDown, Plus, Briefcase, X, MessageSquare
} from 'lucide-react';
import AgileBoard from './components/AgileBoard';
import Dashboard from './components/Dashboard';
import Roadmap from './components/Roadmap';
import Settings from './components/Settings';
import IssueModal from './components/IssueModal';
import ProjectModal from './components/ProjectModal';
import Backlog from './components/Backlog';
import Login from './components/Login';
import { Issue, Column, Priority, IssueType, ViewMode, User as UserType, Project } from './types';

// --- UPDATED MOCK DATA ---
const INITIAL_USERS: UserType[] = [
  { id: '1', name: 'Rafa Maheswara', role: 'Manager', avatar: 'https://picsum.photos/40/40?random=1' },
  { id: '2', name: 'Farid', role: 'Developer', avatar: 'https://picsum.photos/40/40?random=2' },
  { id: '3', name: 'Firman', role: 'Viewer', avatar: 'https://picsum.photos/40/40?random=3' },
  { id: '4', name: 'Super User', role: 'Admin', avatar: 'https://picsum.photos/40/40?random=4' },
  { id: '5', name: 'Admin', role: 'Admin', avatar: 'https://picsum.photos/40/40?random=5' },
];

const INITIAL_PROJECTS: Project[] = [
  { 
    id: 'p1', name: 'Trans Sumatra Phase 2', key: 'TSTR', description: 'Infrastructure development for phase 2.', 
    managerId: '1', memberIds: ['1', '2', '3', '4', '5'], createdAt: new Date() 
  },
  { 
    id: 'p2', name: 'Jakarta Metro Upgrade', key: 'JMU', description: 'Renovation of station facilities.', 
    managerId: '1', memberIds: ['1', '2', '5'], createdAt: new Date() 
  },
];

const INITIAL_COLUMNS: Column[] = [
  { id: 'c1', title: 'To Do', order: 1 },
  { id: 'c2', title: 'In Progress', order: 2 },
  { id: 'c3', title: 'In Review', order: 3 },
  { id: 'c4', title: 'Done', order: 4 },
];

const INITIAL_ISSUES: Issue[] = [
  { 
    id: '1', projectId: 'p1', key: 'TSTR-101', title: 'Design Bridge Pillars Foundation', description: 'Create structural drawings for phase 2.', 
    status: 'c2', priority: Priority.HIGH, type: IssueType.TASK, assigneeId: '2', reporterId: '1', comments: [], createdAt: new Date()
  },
  { 
    id: '2', projectId: 'p1', key: 'TSTR-102', title: 'Procure High Grade Cement', description: 'Contact vendor for bulk pricing.', 
    status: 'c1', priority: Priority.MEDIUM, type: IssueType.STORY, assigneeId: '1', reporterId: '1', comments: [], createdAt: new Date()
  },
  { 
    id: '3', projectId: 'p1', key: 'TSTR-103', title: 'Safety Inspection Report Error', description: 'Mobile app crashes on image upload.', 
    status: 'c1', priority: Priority.CRITICAL, type: IssueType.BUG, assigneeId: '2', reporterId: '3', comments: [], createdAt: new Date()
  },
  { 
    id: '4', projectId: 'p1', key: 'TSTR-104', title: 'Trans Sumatra Phase 2 Planning', description: 'High level roadmap for Q4.', 
    status: 'c2', priority: Priority.HIGH, type: IssueType.EPIC, assigneeId: '1', reporterId: '1', comments: [], createdAt: new Date()
  },
  { 
    id: '5', projectId: 'p2', key: 'JMU-101', title: 'Station A Blueprint', description: 'Initial architectural draft.', 
    status: 'c2', priority: Priority.HIGH, type: IssueType.TASK, assigneeId: '5', reporterId: '5', comments: [], createdAt: new Date()
  },
   { 
    id: '6', projectId: 'p2', key: 'JMU-102', title: 'Escalator Maintenance', description: 'Schedule vendor for checkup.', 
    status: 'c1', priority: Priority.MEDIUM, type: IssueType.TASK, assigneeId: '2', reporterId: '5', comments: [], createdAt: new Date()
  },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, text: "Farid moved TSTR-101 to In Progress", time: "10m ago" },
  { id: 2, text: "Rafa commented on TSTR-104", time: "1h ago" },
  { id: 3, text: "New project JMU created by Admin", time: "2h ago" },
  { id: 4, text: "Safety inspection due tomorrow", time: "5h ago" },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  
  const [currentView, setCurrentView] = useState<ViewMode>('BOARD');
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Closed by default on mobile
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  
  const [editingIssue, setEditingIssue] = useState<Issue | undefined>(undefined);
  const [newIssueStatus, setNewIssueStatus] = useState<string | undefined>(undefined);
  
  const [searchQuery, setSearchQuery] = useState('');

  // --- DERIVED STATE ---
  // Filter projects based on user access
  const availableProjects = currentUser 
    ? projects.filter(p => p.memberIds.includes(currentUser.id) || p.managerId === currentUser.id || currentUser.role === 'Admin')
    : [];

  const activeProject = projects.find(p => p.id === activeProjectId);
  
  // Filter issues for the active project AND search query
  const projectIssues = issues.filter(i => {
    const matchesProject = i.projectId === activeProjectId;
    const matchesSearch = searchQuery === '' || 
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      i.key.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesSearch;
  });

  // --- EFFECTS ---
  // Select first available project on login
  useEffect(() => {
    if (currentUser && availableProjects.length > 0 && !activeProjectId) {
      setActiveProjectId(availableProjects[0].id);
    } else if (currentUser && availableProjects.length === 0) {
      setActiveProjectId(''); // No access to any project
    }
  }, [currentUser, availableProjects.length]);

  // Fix sidebar state on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Init

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- LOGIN GUARD ---
  if (!currentUser) {
    return <Login users={INITIAL_USERS} onLogin={setCurrentUser} />;
  }

  // --- PERMISSIONS ---
  const isReadOnly = currentUser.role === 'Viewer';
  const canAccessSettings = currentUser.role === 'Admin' || currentUser.role === 'Manager';
  const canCreateProject = currentUser.role === 'Admin' || currentUser.role === 'Manager';

  const handleStatusChange = (issueId: string, newStatus: string) => {
    if (isReadOnly) return;
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: newStatus } : i));
  };

  const handleEditIssue = (issue: Issue) => {
    setEditingIssue(issue);
    setModalOpen(true);
  };

  const handleNewIssue = (statusId?: string) => {
    if (isReadOnly || !activeProjectId) return;
    setEditingIssue(undefined);
    setNewIssueStatus(statusId);
    setModalOpen(true);
  };

  const handleSaveIssue = (issueData: Partial<Issue>) => {
    if (isReadOnly || !activeProjectId) return;
    if (issueData.id) {
      // Update
      setIssues(prev => prev.map(i => i.id === issueData.id ? { ...i, ...issueData } as Issue : i));
    } else {
      // Create
      const newIssue: Issue = {
        ...issueData,
        id: Math.random().toString(36).substr(2, 9),
        projectId: activeProjectId,
        key: `${activeProject?.key}-${100 + projectIssues.length + 1}`,
        createdAt: new Date(),
        comments: [],
        reporterId: currentUser.id
      } as Issue;
      setIssues([...issues, newIssue]);
    }
  };

  const handleSaveProject = (projectData: Partial<Project>) => {
    const newProject: Project = {
      ...projectData,
      id: `p${projects.length + 1}`,
    } as Project;
    setProjects([...projects, newProject]);
    setActiveProjectId(newProject.id); // Switch to new project
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('BOARD');
    setActiveProjectId('');
    setSearchQuery('');
  };

  return (
    <div className="flex h-screen w-full bg-[#F3F6F8] text-slate-900 overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>

      {/* Sidebar - HK Branding */}
      <div className={`absolute lg:relative transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 ease-in-out w-72 glass-dark text-white flex flex-col h-full z-40 shadow-2xl`}>
        <div className="h-auto py-6 px-6">
          <div className="flex items-center space-x-3 text-white mb-6">
            <div className="bg-gradient-to-br from-[#D9232D] to-[#B01225] p-2 rounded-xl shadow-lg shadow-red-900/40">
              <Building2 size={24} />
            </div>
            <div>
               <span className="font-bold text-lg tracking-tight block leading-none">HK Project</span>
               <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">One System</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto text-slate-500 hover:text-white">
              <Menu size={20} />
            </button>
          </div>

          {/* PROJECT SWITCHER */}
          <div className="relative">
             <button 
               onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
               className="w-full bg-white/10 hover:bg-white/15 border border-white/5 rounded-2xl p-3 flex items-center justify-between transition-all btn-press group"
             >
               <div className="flex items-center space-x-3 overflow-hidden">
                 <div className="bg-[#D9232D] w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                    {activeProject?.key.substring(0,2) || 'NA'}
                 </div>
                 <div className="text-left min-w-0">
                   <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Current Project</p>
                   <p className="text-sm font-bold truncate">{activeProject?.name || 'No Project'}</p>
                 </div>
               </div>
               <ChevronDown size={16} className={`text-slate-400 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
             </button>

             {isProjectDropdownOpen && (
               <div className="absolute top-full left-0 w-full mt-2 bg-[#0F2745] border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden z-50 animate-fade-in ring-1 ring-white/10">
                 <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                   {availableProjects.map(proj => (
                     <button 
                       key={proj.id}
                       onClick={() => {
                         setActiveProjectId(proj.id);
                         setIsProjectDropdownOpen(false);
                         setCurrentView('BOARD');
                         if(window.innerWidth < 1024) setIsSidebarOpen(false);
                       }}
                       className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${activeProjectId === proj.id ? 'bg-[#D9232D] text-white' : 'text-slate-300 hover:bg-white/5'}`}
                     >
                       <span className="font-mono text-xs opacity-70">{proj.key}</span>
                       <span className="text-sm font-medium truncate">{proj.name}</span>
                       {activeProjectId === proj.id && <div className="ml-auto w-2 h-2 bg-white rounded-full" />}
                     </button>
                   ))}
                 </div>
                 {canCreateProject && (
                   <div className="border-t border-white/10 p-2">
                     <button 
                       onClick={() => {
                         setProjectModalOpen(true);
                         setIsProjectDropdownOpen(false);
                         if(window.innerWidth < 1024) setIsSidebarOpen(false);
                       }}
                       className="w-full flex items-center justify-center space-x-2 p-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                     >
                       <Plus size={14} />
                       <span>Create New Project</span>
                     </button>
                   </div>
                 )}
               </div>
             )}
          </div>
        </div>

        <div className="flex-1 px-4 py-2 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Workspace</p>
          <NavItem icon={<PieChart size={20} />} label="Dashboard" active={currentView === 'DASHBOARD'} onClick={() => { setCurrentView('DASHBOARD'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} />
          <NavItem icon={<Kanban size={20} />} label="Active Board" active={currentView === 'BOARD'} onClick={() => { setCurrentView('BOARD'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} />
          <NavItem icon={<CheckSquare size={20} />} label="Backlog" active={currentView === 'BACKLOG'} onClick={() => { setCurrentView('BACKLOG'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} />
          <NavItem icon={<Calendar size={20} />} label="Roadmap" active={currentView === 'ROADMAP'} onClick={() => { setCurrentView('ROADMAP'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} />
          
          <div className="my-6 border-t border-white/5 mx-4"></div>
          
          <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Configuration</p>
          {canAccessSettings && (
            <NavItem icon={<SettingsIcon size={20} />} label="Settings" active={currentView === 'SETTINGS'} onClick={() => { setCurrentView('SETTINGS'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} />
          )}
        </div>

        <div className="p-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative">
                <img src={currentUser.avatar} className="w-10 h-10 rounded-full border-2 border-[#D9232D]" alt="User" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0F2745]"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-400 truncate">{currentUser.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all btn-press"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden relative">
        {/* Top Header - Glass */}
        <header className="h-20 glass sticky top-0 z-20 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center flex-1 max-w-xl gap-4">
             {/* Mobile Menu Button */}
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:text-[#0F2745]">
                <Menu size={24} />
             </button>
             
             <div className="relative w-full group hidden md:block">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0F2745] transition-colors" size={20} />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder={`Search in ${activeProject?.name || 'projects'}...`}
                 className="w-full pl-12 pr-4 py-3 bg-white/50 border border-transparent focus:bg-white focus:border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-slate-100 outline-none transition-all text-slate-900 shadow-sm"
               />
               {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={16} />
                  </button>
               )}
             </div>
             {/* Mobile Search Icon Only */}
             <button className="md:hidden p-2 text-slate-500 hover:text-[#0F2745]" onClick={() => {/* Toggle mobile search */}}>
                <Search size={24} />
             </button>
          </div>
          <div className="flex items-center space-x-3 md:space-x-6 ml-2 md:ml-6 relative">
             <button 
               onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
               className={`relative p-2 md:p-3 rounded-2xl transition-all btn-press ${isNotificationsOpen ? 'bg-white text-[#0F2745]' : 'text-slate-500 hover:text-[#0F2745] hover:bg-white'}`}
             >
               <Bell size={20} md:size={22} />
               <span className="absolute top-2 md:top-3 right-2 md:right-3 w-2.5 h-2.5 bg-[#D9232D] rounded-full border-2 border-white"></span>
             </button>

             {/* NOTIFICATIONS POPUP */}
             {isNotificationsOpen && (
               <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 animate-fade-in overflow-hidden">
                 <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-[#0F2745]">Notifications</h3>
                    <button className="text-xs text-[#00529C] font-bold">Mark all read</button>
                 </div>
                 <div className="max-h-80 overflow-y-auto custom-scrollbar">
                   {MOCK_NOTIFICATIONS.map(notif => (
                     <div key={notif.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex items-start space-x-3">
                        <div className="bg-blue-50 p-2 rounded-full text-[#00529C]">
                           <MessageSquare size={16} />
                        </div>
                        <div>
                           <p className="text-sm text-slate-800 leading-snug">{notif.text}</p>
                           <p className="text-xs text-slate-400 mt-1 font-medium">{notif.time}</p>
                        </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {!isReadOnly && activeProjectId && (
               <button 
                 onClick={() => handleNewIssue()}
                 className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-[#D9232D] to-[#B01225] text-white pl-4 pr-5 py-3 rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-red-900/20 transition-all btn-press"
               >
                 <PlusCircle size={20} />
                 <span>Create</span>
               </button>
             )}
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 overflow-hidden relative" onClick={() => setIsNotificationsOpen(false)}>
           {!activeProjectId && (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                 <Briefcase size={64} className="text-slate-300 mb-4" />
                 <h2 className="text-2xl font-bold text-[#0F2745]">No Project Selected</h2>
                 <p className="text-slate-500 mt-2 max-w-md">You are not assigned to any projects, or no project is currently selected.</p>
                 {canCreateProject && (
                    <button onClick={() => setProjectModalOpen(true)} className="mt-6 text-[#D9232D] font-bold hover:underline">Create a new project</button>
                 )}
              </div>
           )}

           {activeProjectId && currentView === 'BOARD' && (
             <AgileBoard 
               issues={projectIssues} 
               columns={INITIAL_COLUMNS} 
               onStatusChange={handleStatusChange} 
               onEditIssue={handleEditIssue}
               onNewIssue={handleNewIssue}
               isReadOnly={isReadOnly}
             />
           )}
           {activeProjectId && currentView === 'DASHBOARD' && (
             <Dashboard 
               issues={projectIssues} 
               onNavigate={(view) => setCurrentView(view)} 
             />
           )}
           {activeProjectId && currentView === 'ROADMAP' && <Roadmap issues={projectIssues} />}
           {currentView === 'SETTINGS' && canAccessSettings ? (
             <Settings users={INITIAL_USERS} currentUser={currentUser} />
           ) : currentView === 'SETTINGS' ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <p>You do not have permission to view settings.</p>
              </div>
           ) : null}
           {activeProjectId && currentView === 'BACKLOG' && (
             <Backlog 
               issues={projectIssues} 
               onEditIssue={handleEditIssue} 
             />
           )}
        </main>

        {/* Floating Action Button (Mobile) - Hide for read only */}
        {!isReadOnly && activeProjectId && (
          <button 
            onClick={() => handleNewIssue()}
            className="sm:hidden absolute bottom-6 right-6 w-14 h-14 bg-[#D9232D] text-white rounded-full shadow-2xl shadow-red-900/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-30"
          >
            <PlusCircle size={28} />
          </button>
        )}

      </div>

      <IssueModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={handleSaveIssue}
        issue={editingIssue}
        columns={INITIAL_COLUMNS}
        users={INITIAL_USERS} // In a real app, filter users by project members
        defaultStatus={newIssueStatus}
        isReadOnly={isReadOnly}
      />

      <ProjectModal 
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSave={handleSaveProject}
        currentUser={currentUser}
        users={INITIAL_USERS}
      />
    </div>
  );
};

// Helper Subcomponent - Redesigned for HK Blue Sidebar
const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3.5 px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-200 group btn-press ${
      active 
        ? 'bg-[#D9232D] text-white shadow-lg shadow-red-900/20' 
        : 'text-slate-400 hover:text-white hover:bg-white/10'
    }`}
  >
    <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`}>
      {icon}
    </span>
    <span>{label}</span>
  </button>
);

export default App;